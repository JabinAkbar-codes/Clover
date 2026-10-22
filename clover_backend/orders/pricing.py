"""Single source of truth for shipping + coupon rules (frontend reads /api/config/)."""
from decimal import Decimal

FREE_SHIPPING_THRESHOLD = Decimal('999')
SHIPPING_FEE = Decimal('79')
COD_FEE = Decimal('49')

# code -> {type: percent|flat, value, min_subtotal, label}
COUPONS = {
    'WELCOME10': {'type': 'percent', 'value': Decimal('10'), 'min_subtotal': Decimal('0'), 'label': '10% off your order'},
    'CLOVER200': {'type': 'flat', 'value': Decimal('200'), 'min_subtotal': Decimal('1999'), 'label': '₹200 off orders above ₹1,999'},
}


def coupon_discount(code, subtotal):
    """Returns (discount, error). discount is a Decimal."""
    if not code:
        return Decimal('0'), None
    c = COUPONS.get(code.strip().upper())
    if not c:
        return Decimal('0'), 'Invalid coupon code.'
    if subtotal < c['min_subtotal']:
        return Decimal('0'), f"This coupon needs a minimum order of ₹{int(c['min_subtotal']):,}."
    if c['type'] == 'percent':
        return (subtotal * c['value'] / 100).quantize(Decimal('1')), None
    return min(c['value'], subtotal), None


def shipping_for(subtotal_after_discount):
    return Decimal('0') if subtotal_after_discount >= FREE_SHIPPING_THRESHOLD else SHIPPING_FEE
