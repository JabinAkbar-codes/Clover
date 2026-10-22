import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiLock } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'
import { formatPrice } from '../utils/formatPrice'
import { FREE_SHIPPING_THRESHOLD } from '../utils/shop'
import '../styles/CartDrawer.css'

export default function CartDrawer() {
  const { items, count, subtotal, drawerOpen, closeDrawer, updateQty, removeFromCart } = useCart()
  const { pathname } = useLocation()

  useEffect(() => { closeDrawer() }, [pathname, closeDrawer])
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && closeDrawer()
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [drawerOpen, closeDrawer])

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} />
          <motion.aside className="cart-drawer" role="dialog" aria-label="Shopping bag" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
            <div className="cart-drawer-head">
              <h3>Your Bag ({count})</h3>
              <button className="cart-close-btn" onClick={closeDrawer} aria-label="Close bag"><FiX /></button>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <FiShoppingBag />
                <p>Your bag is empty.</p>
                <Link to="/shop/necklaces" className="btn-clover" onClick={closeDrawer}>Continue Shopping</Link>
              </div>
            ) : (
              <>
                <div className="ship-progress">
                  {remaining > 0 ? <span>Add <strong>{formatPrice(remaining)}</strong> more for <strong>free shipping</strong></span> : <span>🎉 You've unlocked <strong>free shipping</strong>!</span>}
                  <div className="ship-bar"><span style={{ width: `${pct}%` }} /></div>
                </div>

                <div className="cart-items">
                  {items.map((item) => (
                    <div className="cart-item" key={item.key}>
                      <Link to={`/product/${item.slug}`} className="cart-item-img" onClick={closeDrawer}>
                        <ProductImage src={item.image} alt={item.name} tone={item.id} />
                      </Link>
                      <div>
                        <p className="cart-item-name">{item.name}</p>
                        {item.personalization && <p className="cart-item-meta">Engraving: “{item.personalization}”</p>}
                        <p className="cart-item-price">{formatPrice(item.price)}</p>
                        <div className="qty">
                          <button onClick={() => updateQty(item.key, item.qty - 1)} aria-label="Decrease quantity"><FiMinus /></button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)} disabled={item.qty >= 10} aria-label="Increase quantity"><FiPlus /></button>
                        </div>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.key)} aria-label={`Remove ${item.name}`}><FiTrash2 /></button>
                    </div>
                  ))}
                </div>

                <div className="cart-drawer-footer">
                  <div className="cart-subtotal"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <p className="cart-note">Shipping, coupons and COD charges are calculated at checkout.</p>
                  <Link to="/checkout" className="btn-clover btn-block" onClick={closeDrawer}>Checkout</Link>
                  <div className="cart-secure"><FiLock /> Secure checkout · UPI · Cash on Delivery</div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
