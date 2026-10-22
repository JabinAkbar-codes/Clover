from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='slug', read_only=True)
    category_label = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_label', 'collection', 'description', 'material',
            'price', 'sale_price', 'stock', 'sold_out', 'personalizable', 'badge', 'is_bestseller',
            'images', 'rating', 'reviews_count',
        ]
