import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../utils/shop'

const CartContext = createContext(null)
const KEY = 'clover_cart_v2'
const MAX_QTY = 10

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

// The bag lives in localStorage for everyone (guests + logged-in users) so checkout is
// frictionless; the server re-prices every item when the order is placed.
export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)) }, [items])
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setItems(load()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addToCart = useCallback((product, qty = 1, personalization = '') => {
    const key = `${product.id}|${personalization}`
    setItems((prev) => {
      const ex = prev.find((i) => i.key === key)
      if (ex) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
      return [...prev, {
        key, id: product.id, slug: product.slug, name: product.name, image: product.images?.[0] ?? product.image ?? '',
        price: product.salePrice ?? product.price, mrp: product.price, qty, personalization,
      }]
    })
    setDrawerOpen(true)
  }, [])

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)).filter((i) => i.qty > 0))
  }, [])
  const removeFromCart = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clearCart = useCallback(() => setItems([]), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const { count, subtotal, mrpTotal } = useMemo(() => ({
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    mrpTotal: items.reduce((s, i) => s + i.qty * i.mrp, 0),
  }), [items])

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE

  const value = { items, count, subtotal, mrpTotal, shipping, drawerOpen, addToCart, removeFromCart, updateQty, clearCart, openDrawer, closeDrawer }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
