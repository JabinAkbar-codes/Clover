#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input

# Load products only when the database is empty, so later admin edits are never overwritten.
COUNT=$(python manage.py shell -c "from catalog.models import Product; print(Product.objects.count())")
if [ "$COUNT" = "0" ]; then
  if [ -f catalog_data.json ]; then
    python manage.py loaddata catalog_data.json
  else
    python manage.py seed_catalog
  fi
fi

# Creates your admin login from the DJANGO_SUPERUSER_* variables (skipped if it already exists).
python manage.py createsuperuser --noinput || true