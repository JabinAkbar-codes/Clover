# CLOVER Backend — Django REST Framework + MySQL

REST API for the CLOVER storefront: products/categories, JWT auth, a
per-user cart, wishlist, and orders. Django's built-in admin doubles as
the product/order management panel.

## Requirements

- Python 3.10+
- pip
- (Optional, for MySQL) a running MySQL 8.x server

## 1. Install dependencies

```bash
cd clover_backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

`mysqlclient` needs MySQL's C headers to build. If `pip install` fails on
it:
- **Ubuntu/Debian:** `sudo apt install default-libmysqlclient-dev build-essential pkg-config`
- **macOS:** `brew install mysql-client pkg-config` then
  `export PKG_CONFIG_PATH="/opt/homebrew/opt/mysql-client/lib/pkgconfig"`
- **Windows:** install MySQL Server (includes the client libs) or use
  `pip install mysqlclient` with the prebuilt wheel that matches your
  Python version.

## 2. Configure the database

Copy the example env file:

```bash
cp .env.example .env
```

**Option A — SQLite (default, zero setup):** leave `USE_MYSQL=False`. The
project already runs against a local `db.sqlite3` file with no further
steps.

**Option B — MySQL (as requested):**

1. Install and start MySQL locally (or use a hosted instance).
2. Create the database and a user:
   ```sql
   CREATE DATABASE clover_db CHARACTER SET utf8mb4;
   CREATE USER 'clover_user'@'localhost' IDENTIFIED BY 'your-password';
   GRANT ALL PRIVILEGES ON clover_db.* TO 'clover_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. In `.env`, set:
   ```
   USE_MYSQL=True
   DB_NAME=clover_db
   DB_USER=clover_user
   DB_PASSWORD=your-password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```

## 3. Migrate and seed data

```bash
python manage.py migrate
python manage.py seed_catalog        # loads 110+ sample products (₹ prices)
python manage.py createsuperuser     # for /admin access
```

## 4. Run the server

```bash
python manage.py runserver
```

API root: `http://localhost:8000/api/`
Admin panel: `http://localhost:8000/admin/`

## API overview

| Endpoint | Method | Auth | Notes |
|---|---|---|---|
| `/api/categories/` | GET | No | List categories |
| `/api/products/` | GET | No | `?category__slug=`, `?search=`, `?ordering=price` |
| `/api/products/<slug>/` | GET | No | Product detail |
| `/api/products/bestsellers/` | GET | No | Curated bestseller list |
| `/api/products/<slug>/related/` | GET | No | Related products |
| `/api/auth/register/` | POST | No | `{username, email, password}` |
| `/api/auth/login/` | POST | No | Returns `{access, refresh}` JWT pair |
| `/api/auth/login/refresh/` | POST | No | Refresh an access token |
| `/api/auth/me/` | GET | Yes | Current user profile |
| `/api/cart/` | GET | Yes | View your cart |
| `/api/cart/add/` | POST | Yes | `{product_slug, qty}` |
| `/api/cart/update-item/` | POST | Yes | `{item_id, qty}` |
| `/api/cart/remove-item/` | POST | Yes | `{item_id}` |
| `/api/wishlist/` | GET/POST | Yes | `{product_slug}` to add |
| `/api/wishlist/<id>/` | DELETE | Yes | Remove an item |
| `/api/orders/` | GET/POST | Yes | Places an order from the current cart |

All authenticated endpoints expect `Authorization: Bearer <access token>`.

## Managing products & orders

Everything is editable from `/admin/` once you've created a superuser —
add/edit products and categories, adjust stock, and update order status,
all with no extra code.

## Running the whole stack together

1. Start this backend: `python manage.py runserver` (port 8000)
2. In a separate terminal, start the frontend (see the frontend's own
   README): `npm run dev` (port 5173)

The frontend's `VITE_API_URL` (see its `.env.example`) already points at
`http://localhost:8000/api` by default, and CORS is pre-configured to
allow `http://localhost:5173`. If the backend isn't running, the
frontend falls back to a bundled local product dataset so the storefront
still works standalone.
