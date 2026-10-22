from decimal import Decimal

from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product

from . import pricing
from .models import Order, OrderItem
from .serializers import CheckoutSerializer, ConfirmUpiSerializer, OrderSerializer


class ConfigView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'free_shipping_threshold': pricing.FREE_SHIPPING_THRESHOLD,
            'shipping_fee': pricing.SHIPPING_FEE,
            'cod_fee': pricing.COD_FEE,
            'coupons': [{'code': k, 'label': v['label']} for k, v in pricing.COUPONS.items()],
        })


class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '')
        subtotal = Decimal(str(request.data.get('subtotal', 0)))
        discount, error = pricing.coupon_discount(code, subtotal)
        if error:
            return Response({'detail': error}, status=400)
        return Response({'code': code.upper(), 'discount': discount})


class OrderViewSet(viewsets.GenericViewSet):
    """Guest checkout is allowed; logged-in users also get an order history."""
    serializer_class = OrderSerializer
    lookup_field = 'order_number'

    def get_permissions(self):
        if self.action in ('create', 'track', 'confirm_upi'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def list(self, request):
        return Response(OrderSerializer(self.get_queryset(), many=True).data)

    @action(detail=False, methods=['get'])
    def track(self, request):
        number = request.query_params.get('order_number', '').strip().upper()
        email = request.query_params.get('email', '').strip().lower()
        order = Order.objects.filter(order_number=number, email__iexact=email).prefetch_related('items').first()
        if not order:
            return Response({'detail': 'No order found with those details.'}, status=404)
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['post'], url_path='confirm-upi')
    def confirm_upi(self, request):
        s = ConfirmUpiSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        order = Order.objects.filter(order_number=d['order_number'].upper(), email__iexact=d['email'], payment_method='upi').first()
        if not order:
            return Response({'detail': 'Order not found.'}, status=404)
        if order.payment_status == 'paid':
            return Response({'detail': 'This order is already paid.'}, status=400)
        order.upi_ref = d['upi_ref']
        order.payment_status = 'verification'
        order.save(update_fields=['upi_ref', 'payment_status'])
        return Response(OrderSerializer(order).data)

    @transaction.atomic
    def create(self, request):
        s = CheckoutSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        data = s.validated_data

        # Re-price everything on the server — never trust prices from the browser.
        slugs = [i['slug'] for i in data['items']]
        products = {p.slug: p for p in Product.objects.select_for_update().filter(slug__in=slugs)}
        lines, subtotal = [], Decimal('0')
        for item in data['items']:
            product = products.get(item['slug'])
            if not product:
                return Response({'detail': f"Product '{item['slug']}' no longer exists."}, status=400)
            if product.sold_out or product.stock < item['qty']:
                return Response({'detail': f"'{product.name}' is out of stock or has fewer than {item['qty']} left."}, status=400)
            unit = product.sale_price or product.price
            subtotal += unit * item['qty']
            lines.append((product, unit, item))

        discount, error = pricing.coupon_discount(data.get('coupon_code', ''), subtotal)
        if error:
            return Response({'detail': error}, status=400)
        shipping = pricing.shipping_for(subtotal - discount)
        method = data['payment_method']
        cod_fee = pricing.COD_FEE if method == 'cod' else Decimal('0')
        total = subtotal - discount + shipping + cod_fee

        if method == 'cod':
            pay_status = 'cod'
        else:
            pay_status = 'pending'  # UPI: customer pays on the next screen, then submits the UTR

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            full_name=data['full_name'], email=data['email'].lower(), phone=data['phone'],
            address=data['address'], city=data['city'], state=data['state'], postal_code=data['postal_code'],
            payment_method=method, payment_status=pay_status, upi_ref=data.get('upi_ref', ''),
            subtotal=subtotal, discount=discount, shipping_fee=shipping, cod_fee=cod_fee,
            coupon_code=(data.get('coupon_code') or '').upper(), total=total,
            status='confirmed' if method == 'cod' else 'pending',
        )
        for product, unit, item in lines:
            OrderItem.objects.create(
                order=order, product=product, product_name=product.name, product_slug=product.slug,
                unit_price=unit, qty=item['qty'], personalization=item.get('personalization', ''),
            )
            product.stock -= item['qty']
            product.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
