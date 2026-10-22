# CLOVER — Full-stack Jewellery Store

React 19 + Vite + Swiper (frontend) · Django REST Framework + JWT (backend) · INR · UPI + COD.

```
clover/           React frontend   (deploy to Vercel)
clover_backend/   Django API       (deploy to Render)
render.yaml       Render blueprint (backend + Postgres)
```

## 1. Run locally

### Backend (Terminal 1)
```bash
cd clover_backend
python -m venv venv
# Windows:  venv\Scripts\activate        macOS/Linux:  source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # Windows: copy .env.example .env
python manage.py migrate
python manage.py seed_catalog   # loads 149 products (INR, blank image slots)
python manage.py createsuperuser
python manage.py runserver      # http://localhost:8000   (admin: /admin/)
```
SQLite is used by default. For MySQL: `pip install -r requirements-mysql.txt`, then set `USE_MYSQL=True` and the `DB_*` values in `.env`.

### Frontend (Terminal 2)
```bash
cd clover
npm install
cp .env.example .env            # Windows: copy .env.example .env  -> set VITE_UPI_VPA to your real UPI ID
npm run dev                     # http://localhost:5173
```

### Checks
```bash
cd clover_backend && python manage.py test
cd clover && npm run lint && npm run build
```

## 2. Add your real product images
Copy files into `clover/public/products/` (e.g. `ring-1.jpg`), then in **/admin → Products → (product)** set `images` to
`["/products/ring-1.jpg", "/products/ring-2.jpg", "/products/ring-3.jpg"]`.
An empty string `""` shows the placeholder. Every product already has 2-4 image slots.
Re-running `seed_catalog` never overwrites images you set in admin.

If the API is unreachable the site falls back to `clover/src/data/products.json` (same products).

## 3. Payments
* **UPI** — after "Place order" the customer sees a QR + PhonePe / Google Pay / Paytm buttons built from `VITE_UPI_VPA`, pays, then submits the 12-digit UTR. The order shows "Verifying payment". In **/admin → Orders** check your bank/UPI app, then set payment status to **Paid** and update the order status.
* **COD** — Rs 49 handling fee, order auto-confirmed.
* **Cards / Net Banking** — shown as "Coming soon". A QR payment cannot be auto-verified without a gateway; add Razorpay (needs your keys) for automatic verification.

Coupons live in `clover_backend/orders/pricing.py`: `WELCOME10` (10%), `CLOVER200` (Rs 200 off above Rs 1,999). Free shipping from Rs 999.

## 4. Deploy

### Backend -> Render
1. Push the repo to GitHub.
2. Render -> **New -> Blueprint** -> pick the repo (uses `render.yaml`: web service + free Postgres).
3. After the first deploy, open the service -> **Environment** and set
   `CORS_ALLOWED_ORIGINS=https://YOUR-APP.vercel.app` and `CSRF_TRUSTED_ORIGINS=https://YOUR-APP.vercel.app`.
4. Render **Shell** -> `python manage.py createsuperuser`.
   (Free tier sleeps when idle; the first request can take ~50s. The site shows bundled products meanwhile.)

### Frontend -> Vercel
1. Vercel -> **Add New Project** -> import the repo -> **Root Directory: `clover`** (Vite is auto-detected).
2. Environment variables:
   `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`
   `VITE_UPI_VPA=your@upi`   `VITE_UPI_NAME=CLOVER`
3. Deploy. `vercel.json` already handles page-refresh routing.

## What's new in this update
* **Nav**: smaller link text. CHARMS -> `/shop/charms`, PERSONALIZE -> `/personalize`, SALE -> `/sale`.
* **Charms page**: charms only, lunaeshop-style 3-column grid with Filter and "Sort by".
* **Personalize page**: 2-step builder (1. choose jewellery: necklace / bracelet / earrings / anklet, 2. choose up to 5 charms), then Add to Bag or Save to Wishlist.
* **Sale page**: only products with an offer price, plus a "biggest discount" sort.
* **About / Contact**: redesigned; contact cards, form and FAQ are aligned.
* **Home**: Personalize / Make Your Own images fill their panels; testimonials scroll endlessly (hover to pause).
* Page transitions, scroll reveals and a back-to-top button.
