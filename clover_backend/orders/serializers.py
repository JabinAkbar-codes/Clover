from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_slug', 'unit_price', 'qty', 'personalization', 'line_total']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_number', 'status', 'full_name', 'email', 'phone', 'address', 'city', 'state', 'postal_code',
            'country', 'payment_method', 'payment_status', 'upi_ref', 'subtotal', 'discount', 'shipping_fee',
            'cod_fee', 'coupon_code', 'total', 'created_at', 'items',
        ]


class CheckoutItemSerializer(serializers.Serializer):
    slug = serializers.CharField()
    qty = serializers.IntegerField(min_value=1, max_value=10)
    personalization = serializers.CharField(required=False, allow_blank=True, max_length=40)


class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.RegexField(r'^[6-9]\d{9}$', error_messages={'invalid': 'Enter a valid 10-digit Indian mobile number.'})
    address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.RegexField(r'^[1-9]\d{5}$', error_messages={'invalid': 'Enter a valid 6-digit PIN code.'})
    payment_method = serializers.ChoiceField(choices=['upi', 'cod'])
    upi_ref = serializers.CharField(required=False, allow_blank=True, max_length=40)
    coupon_code = serializers.CharField(required=False, allow_blank=True, max_length=30)
    items = CheckoutItemSerializer(many=True, allow_empty=False)


class ConfirmUpiSerializer(serializers.Serializer):
    order_number = serializers.CharField()
    email = serializers.EmailField()
    upi_ref = serializers.RegexField(r'^\d{12}$', error_messages={'invalid': 'Enter the 12-digit UPI reference (UTR) number.'})
