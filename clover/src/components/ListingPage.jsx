import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSliders, FiX, FiSearch } from 'react-icons/fi'
import ProductCard from './ProductCard'
import Seo from './Seo'
import useCatalog from '../hooks/useCatalog'
import { sortProducts, effectivePrice } from '../api/products'
import { CATEGORIES } from '../utils/shop'
import '../styles/Listing.css'

const PAGE = 12
const PRICE_BANDS = [
  { id: 'u2', label: 'Under ₹2,000', test: (v) => v < 2000 },
  { id: '2-4', label: '₹2,000 – ₹4,000', test: (v) => v >= 2000 && v < 4000 },
  { id: '4-6', label: '₹4,000 – ₹6,000', test: (v) => v >= 4000 && v < 6000 },
  { id: '6+', label: '₹6,000 & above', test: (v) => v >= 6000 },
]

function Filters({ bands, setBands, inStock, setInStock, onSale, setOnSale, clear, hideSale }) {
  const toggle = (id) => setBands((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]))
  return (
    <div>
      <div className="filter-group">
        <h4>Availability</h4>
        <label className="check"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock only</label>
        {!hideSale && <label className="check"><input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} /> On sale</label>}
      </div>
      <div className="filter-group">
        <h4>Price</h4>
        {PRICE_BANDS.map((b) => (
          <label className="check" key={b.id}><input type="checkbox" checked={bands.includes(b.id)} onChange={() => toggle(b.id)} /> {b.label}</label>
        ))}
      </div>
      <button className="filter-clear" onClick={clear}>Clear all filters</button>
    </div>
  )
}

export default function ListingPage({ title, kicker, subtitle, filter, categoryChips = false, searchable = false, layout = 'sidebar', cardVariant = 'default', sortOptions = [], hero = null, defaultLabel = 'Featured' }) {
  const compact = layout === 'compact' // lunae-style: filter button + sort on one row, no sidebar
  const { products, loading } = useCatalog()
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') || 'featured'
  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const [bands, setBands] = useState([])
  const [inStock, setInStock] = useState(false)
  const [onSale, setOnSale] = useState(false)
  const [visible, setVisible] = useState(PAGE)
  const [sheet, setSheet] = useState(false)

  const setParam = (k, v) => setParams((p) => { const n = new URLSearchParams(p); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  const clear = () => { setBands([]); setInStock(false); setOnSale(false) }

  const base = useMemo(() => products.filter(filter), [products, filter])

  const list = useMemo(() => {
    let l = base
    if (cat) l = l.filter((p) => p.category === cat)
    if (q) { const s = q.toLowerCase(); l = l.filter((p) => `${p.name} ${p.categoryLabel} ${p.description}`.toLowerCase().includes(s)) }
    if (inStock) l = l.filter((p) => !p.soldOut)
    if (onSale) l = l.filter((p) => p.salePrice)
    if (bands.length) { const tests = PRICE_BANDS.filter((b) => bands.includes(b.id)); l = l.filter((p) => tests.some((b) => b.test(effectivePrice(p)))) }
    return sortProducts(l, sort)
  }, [base, cat, q, inStock, onSale, bands, sort])

  useEffect(() => { setVisible(PAGE) }, [list.length, sort, cat, q])

  const fp = { bands, setBands, inStock, setInStock, onSale, setOnSale, clear, hideSale: false }
  const activeFilters = bands.length + (inStock ? 1 : 0) + (onSale ? 1 : 0)

  return (
    <div>
      <Seo title={title} />
      <div className={`listing-hero ${compact ? 'compact' : ''}`}>
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {hero}
        {searchable && (
          <div className="search-box">
            <FiSearch />
            <input type="search" placeholder="Search jewellery…" value={q} onChange={(e) => setParam('q', e.target.value)} aria-label="Search products" />
          </div>
        )}
      </div>

      <div className="wrap">
        {categoryChips && (
          <div className="chips" role="tablist">
            <button className={`chip ${!cat ? 'active' : ''}`} onClick={() => setParam('cat', '')}>All</button>
            {CATEGORIES.filter((c) => base.some((p) => p.category === c.slug)).map((c) => (
              <button key={c.slug} className={`chip ${cat === c.slug ? 'active' : ''}`} onClick={() => setParam('cat', c.slug)}>{c.label}</button>
            ))}
          </div>
        )}

        <div className="toolbar">
          {compact ? (
            <button className="filter-btn" onClick={() => setSheet(true)}><FiSliders /> Filter{activeFilters ? ` (${activeFilters})` : ''}</button>
          ) : (
            <span className="count">{loading ? 'Loading…' : `${list.length} product${list.length === 1 ? '' : 's'}`}</span>
          )}
          <div className="toolbar-right">
            {!compact && <button className="filter-btn filter-mobile-only" onClick={() => setSheet(true)}><FiSliders /> Filter{activeFilters ? ` (${activeFilters})` : ''}</button>}
            {compact && <span className="sort-label">Sort by:</span>}
            <select className="sort-select" value={sort} onChange={(e) => setParam('sort', e.target.value === 'featured' ? '' : e.target.value)} aria-label="Sort products">
              <option value="featured">{defaultLabel}</option>
              {sortOptions.includes('discount') && <option value="discount">Biggest discount</option>}
              <option value="newest">New arrivals</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetically, A–Z</option>
            </select>
            {compact && <span className="count">{loading ? '' : `${list.length} products`}</span>}
          </div>
        </div>

        <div className={`listing-layout ${compact ? 'no-side' : ''}`}>
          {!compact && <aside className="filters"><Filters {...fp} /></aside>}
          <div>
            {loading ? (
              <div className={`product-grid ${compact ? 'grid-3' : ''}`}>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}</div>
            ) : list.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try removing a filter or searching for something else.</p>
                <button className="btn-clover" onClick={() => { clear(); setParams({}, { replace: true }) }}>Reset filters</button>
              </div>
            ) : (
              <>
                <div className={`product-grid ${compact ? 'grid-3' : ''}`}>
                  {list.slice(0, visible).map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}>
                      <ProductCard product={p} variant={cardVariant} />
                    </motion.div>
                  ))}
                </div>
                {visible < list.length && (
                  <div className="load-more"><button className="btn-ghost" onClick={() => setVisible((v) => v + PAGE)}>View More</button></div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {sheet && (
        <div className="filter-sheet" onClick={() => setSheet(false)}>
          <div className="filter-sheet-inner" onClick={(e) => e.stopPropagation()}>
            <div className="filter-sheet-head"><h3>Filters</h3><button className="cart-close-btn" onClick={() => setSheet(false)} aria-label="Close filters"><FiX /></button></div>
            <Filters {...fp} />
            <button className="btn-clover btn-block" style={{ marginTop: 18 }} onClick={() => setSheet(false)}>Show {list.length} results</button>
          </div>
        </div>
      )}
    </div>
  )
}
