import secrets

from django.conf import settings
from django.db import models

from catalog.models import Product

ORDER_STATUS = [
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
]
PAYMENT_METHODS = [('upi', 'UPI'), ('card', 'Card'), ('cod', 'Cash on Delivery')]
PAYMENT_STATUS = [('pending', 'Pending'), ('verification', 'Awaiting verification'), ('paid', 'Paid'), ('cod', 'Pay on delivery'), ('failed', 'Failed')]


def generate_order_number():
    return 'CLV' + secrets.token_hex(3).upper()


class Order(models.Model):
    order_number = models.CharField(max_length=12, unique=True, default=generate_order_number, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='orders')
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')

    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='India')

    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='upi')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    upi_ref = models.CharField('UPI transaction / UTR ref', max_length=40, blank=True)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cod_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coupon_code = models.CharField(max_length=30, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.order_number} - {self.full_name}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)
    product_slug = models.CharField(max_length=220, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    qty = models.PositiveIntegerField(default=1)
    personalization = models.CharField(max_length=40, blank=True)

    @property
    def line_total(self):
        return self.unit_price * self.qty
