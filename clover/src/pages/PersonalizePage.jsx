import React, { useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiHeart, FiShoppingBag, FiX, FiPlus } from 'react-icons/fi'
import useCatalog from '../hooks/useCatalog'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { CATEGORIES } from '../utils/shop'
import { formatPrice } from '../utils/formatPrice'
import '../styles/Personalize.css'

const BASE_CATS = ['necklaces', 'bracelets', 'earrings', 'anklets']
const MAX_CHARMS = 5
const price = (p) => p.salePrice ?? p.price

function PickCard({ product, selected, onClick, badge }) {
  return (
    <button type="button" className={`pick ${selected ? 'on' : ''}`} onClick={onClick} aria-pressed={selected}>
      <span className="pick-media">
        <ProductImage src={product.images?.[0]} alt={product.name} tone={product.id} />
        <span className="pick-check">{selected ? <FiCheck /> : <FiPlus />}</span>
        {badge && <span className="pick-badge">{badge}</span>}
      </span>
      <span className="pick-name">{product.name}</span>
      <span className="pick-price">
        {product.salePrice && <s>{formatPrice(product.price)}</s>} {formatPrice(price(product))}
      </span>
    </button>
  )
}

const rail = {
  0: { slidesPerView: 1.9, spaceBetween: 10 },
  480: { slidesPerView: 2.4, spaceBetween: 12 },
  768: { slidesPerView: 3.4, spaceBetween: 14 },
  1100: { slidesPerView: 5, spaceBetween: 16 },
}

export default function PersonalizePage() {
  const { products, loading } = useCatalog()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const toast = useToast()
  const [cat, setCat] = useState('necklaces')
  const [base, setBase] = useState(null)
  const [charms, setCharms] = useState([])
  const pickerRef = useRef(null)
  const charmRef = useRef(null)

  const baseList = useMemo(() => products.filter((p) => p.category === cat && !p.soldOut), [products, cat])
  const charmList = useMemo(() => products.filter((p) => p.category === 'charms' && !p.soldOut), [products])
  const tiles = BASE_CATS.map((s) => CATEGORIES.find((c) => c.slug === s)).filter(Boolean)

  const total = (base ? price(base) : 0) + charms.reduce((s, c) => s + price(c), 0)
  const toggleCharm = (c) => {
    setCharms((cur) => {
      if (cur.some((x) => x.id === c.id)) return cur.filter((x) => x.id !== c.id)
      if (cur.length >= MAX_CHARMS) { toast(`You can add up to ${MAX_CHARMS} charms`); return cur }
      return [...cur, c]
    })
  }
  const pickCat = (slug) => {
    setCat(slug)
    if (base && base.category !== slug) setBase(null)
    setTimeout(() => pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }
  const reset = () => { setBase(null); setCharms([]) }

  const addAll = () => {
    if (!base) return toast('Choose your jewellery first')
    addToCart(base, 1)
    charms.forEach((c) => addToCart(c, 1))
    toast(`Added ${1 + charms.length} piece${charms.length ? 's' : ''} to your bag`)
  }
  const wishAll = async () => {
    if (!base) return toast('Choose your jewellery first')
    const items = [base, ...charms].filter((p) => !isWishlisted(p.id))
    try {
      for (const p of items) await toggleWishlist(p)
      toast(items.length ? `Saved ${items.length} piece${items.length > 1 ? 's' : ''} to wishlist` : 'Already in your wishlist')
    } catch { toast('Could not update wishlist') }
  }

  const hasSelection = Boolean(base) || charms.length > 0
  const catLabel = CATEGORIES.find((c) => c.slug === cat)?.label

  return (
    <div className="pz">
      <Seo title="Personalize" />
      <div className="pz-hero">
        <p className="section-kicker">Make it yours</p>
        <h1>Personalize</h1>
        <p className="pz-sub">Build a piece that's entirely you — pick your jewellery, sprinkle on charms, then add it to your bag.</p>
        <ol className="pz-steps">
          <li className="done"><span>1</span> Jewellery</li>
          <li className={base ? 'done' : ''}><span>2</span> Charms</li>
          <li className={base ? 'done' : ''}><span>3</span> Wishlist or Bag</li>
        </ol>
      </div>

      {/* ---------- Step 1 ---------- */}
      <section className="pz-section">
        <div className="wrap">
          <Reveal className="pz-head"><h2><em>1.</em> Choose your Jewellery</h2><p>Start with a necklace, bracelet, earrings or anklet.</p></Reveal>

          <Swiper className="pz-tiles" spaceBetween={12} allowTouchMove breakpoints={{ 0: { slidesPerView: 2.1 }, 640: { slidesPerView: 4, allowTouchMove: false, spaceBetween: 18 } }}>
            {tiles.map((t, i) => (
              <SwiperSlide key={t.slug}>
                <motion.button type="button" whileTap={{ scale: 0.97 }} className={`pz-tile ${cat === t.slug ? 'on' : ''}`} onClick={() => pickCat(t.slug)} aria-pressed={cat === t.slug}>
                  <span className="pz-tile-media"><ProductImage src={t.image} alt={t.label} tone={i} /></span>
                  <span className="pz-tile-label">{t.label}{cat === t.slug && <FiCheck />}</span>
                </motion.button>
              </SwiperSlide>
            ))}
          </Swiper>

          <div ref={pickerRef} className="pz-picker">
            <div className="pz-picker-head">
              <h3>Select your {catLabel?.replace(/s$/, '').toLowerCase()}</h3>
              <span>{baseList.length} to choose from</span>
            </div>
            {loading ? <div className="skeleton" style={{ height: 280 }} /> : (
              <Swiper key={cat} spaceBetween={12} breakpoints={rail} className="pz-rail">
                {baseList.map((p) => (
                  <SwiperSlide key={p.id}><PickCard product={p} selected={base?.id === p.id} onClick={() => setBase(base?.id === p.id ? null : p)} /></SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Step 2 banner (like the reference design) ---------- */}
      <section className="pz-banner">
        <ProductImage src="/AllProducts/Charms.avif" alt="Charms" tone={2} className="pz-banner-img" />
        <Reveal className="pz-banner-card">
          <h2><em>2.</em> Choose your Charms</h2>
          <p>Make your jewellery unique with a touch of our charms. Sprinkle some charm on your jewellery for a truly unique touch!</p>
          <button type="button" className="btn-clover" onClick={() => charmRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Charms</button>
        </Reveal>
      </section>

      <section className="pz-section" ref={charmRef}>
        <div className="wrap">
          <div className="pz-picker-head">
            <h3>Pick up to {MAX_CHARMS} charms</h3>
            <span>{charms.length}/{MAX_CHARMS} selected</span>
          </div>
          {loading ? <div className="skeleton" style={{ height: 280 }} /> : (
            <div className="pz-charm-grid">
              {charmList.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}>
                  <PickCard product={c} selected={charms.some((x) => x.id === c.id)} onClick={() => toggleCharm(c)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Summary bar ---------- */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div className="pz-bar" initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
            <div className="pz-bar-inner">
              <div className="pz-bar-items" aria-label="Your creation">
                {[base, ...charms].filter(Boolean).map((p) => (
                  <motion.span layout key={p.id} className="pz-chip" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <span className="pz-chip-img"><ProductImage src={p.images?.[0]} alt="" tone={p.id} /></span>
                    <span className="pz-chip-name">{p.name}</span>
                    <button type="button" onClick={() => (p.id === base?.id ? setBase(null) : toggleCharm(p))} aria-label={`Remove ${p.name}`}><FiX /></button>
                  </motion.span>
                ))}
                {!base && <span className="pz-hint">Choose your jewellery to continue</span>}
              </div>
              <div className="pz-bar-total"><small>Total</small><b>{formatPrice(total)}</b></div>
              <div className="pz-bar-actions">
                <button type="button" className="pz-reset" onClick={reset}>Clear</button>
                <button type="button" className="pz-wish" onClick={wishAll} aria-label="Save to wishlist"><FiHeart /></button>
                <button type="button" className="btn-clover" onClick={addAll} disabled={!base}><FiShoppingBag /> Add to Bag</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
