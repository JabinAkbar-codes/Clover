from rest_framework import serializers
from catalog.models import Product
from catalog.serializers import ProductSerializer
from .models import WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_slug = serializers.SlugRelatedField(
        source='product', slug_field='slug', queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_slug', 'added_at']
