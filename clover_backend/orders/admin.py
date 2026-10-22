from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'product_slug', 'unit_price', 'qty', 'personalization')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'full_name', 'phone', 'payment_method', 'payment_status', 'status', 'total', 'created_at']
    list_filter = ['status', 'payment_method', 'payment_status', 'created_at']
    list_editable = ['status', 'payment_status']
    search_fields = ['order_number', 'full_name', 'email', 'phone', 'upi_ref']
    readonly_fields = ['order_number', 'created_at']
    inlines = [OrderItemInline]
