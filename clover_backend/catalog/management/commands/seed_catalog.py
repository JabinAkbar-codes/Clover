import json
from pathlib import Path

from django.core.management.base import BaseCommand

from catalog.models import Category, Product

DATA_FILE = Path(__file__).resolve().parent / 'products_seed.json'


class Command(BaseCommand):
    help = 'Seed categories and products (INR prices, blank image placeholders).'

    def handle(self, *args, **options):
        products = json.loads(DATA_FILE.read_text(encoding='utf-8'))
        categories = {}
        for p in products:
            if p['category'] not in categories:
                categories[p['category']] = Category.objects.update_or_create(
                    slug=p['category'], defaults={'name': p['categoryLabel']})[0]

        created = 0
        for p in products:
            existing = Product.objects.filter(slug=p['slug']).first()
            defaults = {
                'name': p['name'], 'category': categories[p['category']], 'collection': p['collection'],
                'description': p['description'], 'material': p['material'],
                'price': p['price'], 'sale_price': p['salePrice'],
                'stock': 0 if p['soldOut'] else 25, 'sold_out': p['soldOut'], 'personalizable': p['personalizable'],
                'badge': p['badge'], 'is_bestseller': p['bestseller'],
                'rating': p['rating'], 'reviews_count': p['reviews'],
            }
            # Never overwrite images you've already added via the admin panel.
            if existing is None:
                defaults['images'] = p['images']
            _, was_created = Product.objects.update_or_create(slug=p['slug'], defaults=defaults)
            created += was_created
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(categories)} categories, {created} new products ({len(products)} total).'))
