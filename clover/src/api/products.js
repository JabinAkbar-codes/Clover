import client from './client'
import localProducts from '../data/products.json'

// Normalise a DRF product to the camelCase shape the UI uses.
function normalize(p) {
  const images = Array.isArray(p.images) && p.images.length ? p.images : ['', '']
  return {
    id: p.id, slug: p.slug, name: p.name, category: p.category, categoryLabel: p.category_label,
    collection: p.collection || '', price: Number(p.price), salePrice: p.sale_price ? Number(p.sale_price) : null,
    soldOut: p.sold_out, badge: p.badge, bestseller: p.is_bestseller, personalizable: p.personalizable,
    images, material: p.material, description: p.description, rating: Number(p.rating), reviews: p.reviews_count,
  }
}

let cache = null

// One request loads the whole (small) catalogue; filtering/sorting then happens instantly in the browser.
// If the API is unreachable (e.g. Render free tier waking up) we fall back to the bundled dataset.
export function loadCatalog({ force = false } = {}) {
  if (cache && !force) return cache
  cache = (async () => {
    try {
      const { data } = await client.get('/products/', { params: { page_size: 500 }, timeout: 12000 })
      const list = (data.results ?? data).map(normalize)
      if (!list.length) throw new Error('empty')
      return { products: list, live: true }
    } catch {
      return { products: localProducts, live: false }
    }
  })()
  return cache
}

export const effectivePrice = (p) => p.salePrice ?? p.price

export function sortProducts(list, sort) {
  const a = [...list]
  if (sort === 'price-asc') a.sort((x, y) => effectivePrice(x) - effectivePrice(y))
  else if (sort === 'price-desc') a.sort((x, y) => effectivePrice(y) - effectivePrice(x))
  else if (sort === 'discount') a.sort((x, y) => (y.salePrice ? (y.price - y.salePrice) / y.price : 0) - (x.salePrice ? (x.price - x.salePrice) / x.price : 0))
  else if (sort === 'name-asc') a.sort((x, y) => x.name.localeCompare(y.name))
  else if (sort === 'rating') a.sort((x, y) => y.rating - x.rating)
  else if (sort === 'newest') a.sort((x, y) => y.id - x.id)
  return a
}

export const bySlug = (products, slug) => products.find((p) => p.slug === slug)
export const related = (products, p, n = 8) => products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, n)
