from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['id']

    def __str__(self):
        return self.name


BADGE_CHOICES = [('', 'None'), ('New', 'New'), ('Limited', 'Limited')]

COLLECTION_CHOICES = [
    ('', 'None'),
    ('sweet-valentina-collection', 'Sweet Valentina Collection'),
    ('autumn-collection', 'Autumn Collection'),
    ('sun-kissed-ibiza-collection', 'Sun Kissed Ibiza Collection'),
]


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    collection = models.CharField(max_length=60, choices=COLLECTION_CHOICES, blank=True, default='')
    description = models.TextField(blank=True)
    material = models.CharField(max_length=200, blank=True, default='')

    price = models.DecimalField(max_digits=10, decimal_places=2, help_text='MRP in INR')
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    stock = models.PositiveIntegerField(default=25)
    sold_out = models.BooleanField(default=False)
    personalizable = models.BooleanField(default=False)

    badge = models.CharField(max_length=20, choices=BADGE_CHOICES, blank=True, default='')
    is_bestseller = models.BooleanField(default=False)

    images = models.JSONField(
        default=list, blank=True,
        help_text='List of 2-4 image paths/URLs. Leave an entry as "" to show a placeholder. '
                  'Example: ["/products/ring-1.jpg", "/products/ring-2.jpg", ""]',
    )

    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.5)
    reviews_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.stock <= 0:
            self.sold_out = True
        super().save(*args, **kwargs)
