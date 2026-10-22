from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from catalog.views import CategoryViewSet, ProductViewSet
from engage.views import ContactView, NewsletterView
from orders.views import ConfigView, CouponValidateView, OrderViewSet
from wishlist_app.views import WishlistViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

admin.site.site_header = 'CLOVER Admin'
admin.site.site_title = 'CLOVER Admin'


def health(_request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('', health),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/config/', ConfigView.as_view()),
    path('api/coupons/validate/', CouponValidateView.as_view()),
    path('api/contact/', ContactView.as_view()),
    path('api/newsletter/', NewsletterView.as_view()),
    path('api/', include(router.urls)),
]
