from django.test import TestCase
from rest_framework.test import APIClient

from catalog.models import Category, Product


class CheckoutTests(TestCase):
    def setUp(self):
        cat = Category.objects.create(name='Rings', slug='rings')
        self.p = Product.objects.create(name='Ring', slug='ring', category=cat, price=2000, sale_price=1500, stock=3)
        self.client = APIClient()
        self.payload = {
            'full_name': 'Asha K', 'email': 'a@b.com', 'phone': '9876543210', 'address': '1 MG Road', 'city': 'Erode',
            'state': 'Tamil Nadu', 'postal_code': '638001', 'payment_method': 'upi',             'items': [{'slug': 'ring', 'qty': 2}],
        }

    def test_guest_order_reprices_on_server(self):
        r = self.client.post('/api/orders/', self.payload, format='json')
        self.assertEqual(r.status_code, 201, r.data)
        self.assertEqual(str(r.data['subtotal']), '3000.00')
        self.assertEqual(str(r.data['shipping_fee']), '0.00')
        self.assertEqual(r.data['payment_status'], 'pending')
        c = self.client.post('/api/orders/confirm-upi/', {'order_number': r.data['order_number'], 'email': 'a@b.com', 'upi_ref': '123456789012'}, format='json')
        self.assertEqual(c.data['payment_status'], 'verification')
        self.p.refresh_from_db()
        self.assertEqual(self.p.stock, 1)

    def test_coupon_and_cod_fee(self):
        self.payload.update(payment_method='cod', coupon_code='WELCOME10')
        r = self.client.post('/api/orders/', self.payload, format='json')
        self.assertEqual(r.status_code, 201, r.data)
        self.assertEqual(str(r.data['discount']), '300.00')
        self.assertEqual(str(r.data['total']), '2749.00')  # 3000 - 300 + 0 ship + 49 COD

    def test_out_of_stock_rejected(self):
        self.payload['items'][0]['qty'] = 5
        self.assertEqual(self.client.post('/api/orders/', self.payload, format='json').status_code, 400)

    def test_track_order(self):
        n = self.client.post('/api/orders/', self.payload, format='json').data['order_number']
        ok = self.client.get('/api/orders/track/', {'order_number': n, 'email': 'a@b.com'})
        bad = self.client.get('/api/orders/track/', {'order_number': n, 'email': 'x@y.com'})
        self.assertEqual((ok.status_code, bad.status_code), (200, 404))
