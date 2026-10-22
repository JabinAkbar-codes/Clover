import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css/pagination'
import { FiHeart, FiStar, FiMinus, FiPlus, FiShare2 } from 'react-icons/fi'
import useCatalog from '../hooks/useCatalog'
import { bySlug, related as getRelated } from '../api/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'
import ProductRail from '../components/ProductRail'
import PaymentIcons from '../components/PaymentIcons'
import Seo from '../components/Seo'
import { formatPrice, discountPercent } from '../utils/formatPrice'
import '../styles/ProductDetail.css'

const RECENT_KEY = 'clover_recent'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, loading } = useCatalog()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const toast = useToast()
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [engrave, setEngrave] = useState('')
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState('')

  const product = useMemo(() => bySlug(products, slug), [products, slug])

  useEffect(() => { setQty(1); setActive(0); setZoom(false); setEngrave(''); setPinMsg('') }, [slug])

  // Read the previously viewed list first (so the current product isn't in it), then record this visit.
  const recent = useMemo(() => {
    if (!product) return []
    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY)) || []
      return prev.filter((s) => s !== product.slug).map((s) => bySlug(products, s)).filter(Boolean).slice(0, 8)
    } catch { return [] }
  }, [product, products])

  useEffect(() => {
    if (!product) return
    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY)) || []
      localStorage.setItem(RECENT_KEY, JSON.stringify([product.slug, ...prev.filter((s) => s !== product.slug)].slice(0, 9)))
    } catch { /* ignore */ }
  }, [product])

  if (loading) return <div className="pdp-loading">Loading…</div>
  if (!product) {
    return (
      <div className="pdp-loading">
        <h2>We couldn't find that product</h2>
        <Link to="/shop/all" className="btn-clover" style={{ marginTop: 16 }}>Browse all jewellery</Link>
      </div>
    )
  }

  const images = product.images.length >= 2 ? product.images : [...product.images, '']
  const wished = isWishlisted(product.id)
  const off = discountPercent(product.price, product.salePrice)
  const price = product.salePrice ?? product.price
  const needsEngrave = product.personalizable
  const note = engrave.trim()

  const add = () => { addToCart(product, qty, note); }
  const buyNow = () => { addToCart(product, qty, note); navigate('/checkout') }
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else { await navigator.clipboard.writeText(url); toast('Link copied') }
    } catch { /* cancelled */ }
  }
  const checkPin = () => {
    if (!/^[1-9]\d{5}$/.test(pin)) return setPinMsg('Enter a valid 6-digit PIN code.')
    setPinMsg('✓ Delivery available. Usually 3–6 business days.')
  }
  const wish = async () => { try { await toggleWishlist(product); toast(wished ? 'Removed from wishlist' : 'Saved to wishlist') } catch { toast('Could not update wishlist') } }

  const relatedItems = getRelated(products, product)

  return (
    <div className="pdp">
      <Seo title={product.name} />
      <div className="wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>/<Link to={`/shop/${product.category}`}>{product.categoryLabel}</Link>/<span>{product.name}</span>
        </nav>

        <div className="pdp-grid">
          {/* Desktop gallery */}
          <div className="pdp-gallery">
            <div className="pdp-thumbs">
              {images.map((img, i) => (
                <button key={i} className={`pdp-thumb ${active === i ? 'active' : ''}`} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}>
                  <ProductImage src={img} tone={product.id + i} alt="" />
                </button>
              ))}
            </div>
            <div className={`pdp-main ${zoom ? 'zoom' : ''}`} onClick={() => images[active] && setZoom((z) => !z)}
              onMouseMove={(e) => { if (!zoom) return; const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.firstChild.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%` }}>
              <ProductImage src={images[active]} alt={product.name} tone={product.id + active} eager />
              <span className="pdp-count">{active + 1} / {images.length}</span>
            </div>
          </div>

          {/* Mobile gallery (Swiper) */}
          <div className="pdp-mobile-gallery">
            <Swiper modules={[Pagination]} pagination={{ clickable: true }} key={slug}>
              {images.map((img, i) => (
                <SwiperSlide key={i}><ProductImage src={img} alt={`${product.name} ${i + 1}`} tone={product.id + i} eager={i === 0} /></SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="pdp-info">
            <p className="pdp-cat">{product.categoryLabel}</p>
            <h1 className="pdp-name">{product.name}</h1>
            <div className="pdp-rating">
              {[0, 1, 2, 3, 4].map((i) => <FiStar key={i} className={i < Math.round(product.rating) ? 'filled' : ''} />)}
              <span>{product.rating.toFixed(1)} · {product.reviews} reviews</span>
            </div>
            <div className="pdp-price">
              <span>{formatPrice(price)}</span>
              {product.salePrice && (<><span className="price-old">{formatPrice(product.price)}</span><span className="price-off">{off}% off</span></>)}
            </div>
            <p className="pdp-tax">Inclusive of all taxes. Free shipping over ₹999.</p>

            <p className="pdp-desc">{product.description}</p>
            <p className={`pdp-stock ${product.soldOut ? 'out' : ''}`}>{product.soldOut ? 'Currently sold out' : '● In stock — ships in 2–4 business days'}</p>

            {needsEngrave && !product.soldOut && (
              <div className="pdp-engrave">
                <label htmlFor="engrave">Personalize (optional)</label>
                <input id="engrave" value={engrave} maxLength={12} placeholder="Initial or short name, e.g. “Riya”" onChange={(e) => setEngrave(e.target.value)} />
                <small>Up to 12 characters. Personalised pieces are non-returnable.</small>
              </div>
            )}

            <div className="pdp-actions">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><FiMinus /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity"><FiPlus /></button>
              </div>
              <button className="btn-clover" disabled={product.soldOut} onClick={add}>{product.soldOut ? 'Sold Out' : 'Add to Bag'}</button>
              <button className={`pdp-wish ${wished ? 'active' : ''}`} onClick={wish} aria-label="Toggle wishlist"><FiHeart /></button>
              <button className="pdp-wish" onClick={share} aria-label="Share"><FiShare2 /></button>
            </div>
            <button className="btn-ghost pdp-buynow" disabled={product.soldOut} onClick={buyNow}>Buy it now</button>

            <div className="pdp-pin">
              <input inputMode="numeric" maxLength={6} placeholder="Enter PIN code" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} aria-label="PIN code" />
              <button onClick={checkPin}>Check</button>
            </div>
            <p className="pdp-pin-msg" style={pinMsg.startsWith('Enter') ? { color: 'var(--danger)' } : null}>{pinMsg}</p>

            <div className="pdp-pay"><span>Pay securely with</span><PaymentIcons /></div>

            <div className="pdp-acc">
              <details open>
                <summary>Details &amp; materials</summary>
                <div className="acc-body"><ul><li>Material: {product.material}</li><li>Water-resistant, anti-tarnish finish</li><li>Nickel-free &amp; skin-safe</li><li>Comes in a CLOVER gift box</li></ul></div>
              </details>
              <details>
                <summary>Shipping &amp; delivery</summary>
                <div className="acc-body">Free shipping across India on orders over ₹999 (₹79 otherwise). Orders ship within 2–4 business days; delivery takes 3–6 business days. Cash on Delivery is available for a ₹49 handling fee.</div>
              </details>
              <details>
                <summary>Returns &amp; care</summary>
                <div className="acc-body">Easy 7-day returns on unused items in original packaging. Keep your jewellery dry, store it in the pouch provided and apply perfume before wearing.</div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <ProductRail title="You may also like" products={relatedItems} moreTo={`/shop/${product.category}`} moreLabel={`More ${product.categoryLabel}`} />
      {recent.length > 0 && <ProductRail title="Recently viewed" products={recent} alt />}

      <div className="pdp-sticky">
        <div className="sticky-price">{formatPrice(price)}{product.salePrice && <div className="price-old" style={{ fontSize: 12 }}>{formatPrice(product.price)}</div>}</div>
        <button className="btn-clover" disabled={product.soldOut} onClick={add}>{product.soldOut ? 'Sold Out' : 'Add to Bag'}</button>
      </div>
    </div>
  )
}
