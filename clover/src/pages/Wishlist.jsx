import React from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiHeart } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import ProductImage from '../components/ProductImage'
import Seo from '../components/Seo'
import { formatPrice } from '../utils/formatPrice'
import '../styles/Pages.css'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div className="page">
      <Seo title="Wishlist" />
      <div className="wrap">
        <div className="wl-head"><h1>My Wishlist</h1><p>{items.length} saved piece{items.length === 1 ? '' : 's'}</p></div>
        {items.length === 0 ? (
          <div className="empty-state"><FiHeart style={{ fontSize: 40, color: 'var(--taupe)' }} /><h3>You haven't saved anything yet</h3><p>Tap the heart on any piece to save it here.</p><Link to="/shop/all" className="btn-clover">Start Shopping</Link></div>
        ) : (
          <div className="wl-grid">
            {items.map((item) => (
              <div key={item.id}>
                <Link to={`/product/${item.slug}`} className="wl-item-media"><ProductImage src={item.image} alt={item.name} tone={item.productId ?? item.id} /></Link>
                <Link to={`/product/${item.slug}`} className="wl-name">{item.name}</Link>
                <p className="wl-price">{formatPrice(item.price)}</p>
                <div className="wl-actions">
                  <button className="btn-clover" onClick={() => addToCart({ id: item.productId ?? item.id, slug: item.slug, name: item.name, images: [item.image], price: item.price, salePrice: null }, 1)}>Add to Bag</button>
                  <button className="wl-remove" onClick={() => removeFromWishlist(item.id)} aria-label={`Remove ${item.name}`}><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
