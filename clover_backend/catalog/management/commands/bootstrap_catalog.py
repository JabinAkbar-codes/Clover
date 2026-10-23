from pathlib import Path

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand

from catalog.models import Product


class Command(BaseCommand):
    help = 'Load starter products on a brand-new database (does nothing if products already exist).'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write('Products already exist - leaving them untouched.')
            return
        dump = Path(settings.BASE_DIR) / 'catalog_data.json'
        if dump.exists():
            self.stdout.write('Loading products from catalog_data.json ...')
            call_command('loaddata', str(dump))
        else:
            self.stdout.write('catalog_data.json not found - loading the default catalogue ...')
            call_command('seed_catalog')
        self.stdout.write(self.style.SUCCESS(f'Done. {Product.objects.count()} products loaded.'))