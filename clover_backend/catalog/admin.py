from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'collection', 'price', 'sale_price', 'stock', 'sold_out', 'badge', 'is_bestseller')
    list_filter = ('category', 'collection', 'badge', 'is_bestseller', 'sold_out')
    list_editable = ('price', 'sale_price', 'stock', 'badge', 'is_bestseller')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
