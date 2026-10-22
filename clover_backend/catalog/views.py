from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CatalogPagination(PageNumberPagination):
    page_size = 200
    page_size_query_param = 'page_size'
    max_page_size = 1000


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    pagination_class = None


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    pagination_class = CatalogPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'collection', 'sold_out', 'is_bestseller', 'badge']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'name', 'created_at', 'rating']

    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        qs = self.get_queryset().filter(is_bestseller=True, sold_out=False)[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'], url_path='new-arrivals')
    def new_arrivals(self, request):
        qs = self.get_queryset().filter(badge='New', sold_out=False)[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def sale(self, request):
        qs = self.get_queryset().filter(sale_price__isnull=False, sold_out=False)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        product = self.get_object()
        qs = self.get_queryset().filter(category=product.category).exclude(id=product.id)[:8]
        return Response(self.get_serializer(qs, many=True).data)
