import React from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from './Toast'
import ProductImage from './ProductImage'
import { formatPrice, discountPercent } from '../utils/formatPrice'
import '../styles/ProductCard.css'

export default function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const toast = useToast()
  const wished = isWishlisted(product.id)
  const hover = product.images?.[1]
  const off = discountPercent(product.price, product.salePrice)

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (product.soldOut) return
    // Personalisable items need an engraving choice → send to the product page.
    addToCart(product, 1)
  }
  const handleWish = async (e) => {
    e.preventDefault(); e.stopPropagation()
    try {
      await toggleWishlist(product)
      toast(wished ? 'Removed from wishlist' : 'Saved to wishlist')
    } catch { toast('Could not update wishlist') }
  }

  return (
    <div className={`pcard ${variant === 'simple' ? 'simple' : ''}`}>
      <Link to={`/product/${product.slug}`} className="pcard-link">
        <div className="pcard-media">
          <div className="pcard-badges">
            {product.soldOut ? <span className="pcard-badge badge-soldout">Sold out</span> : (
              <>
                {product.salePrice && <span className="pcard-badge badge-sale">-{off}%</span>}
                {product.badge && <span className="pcard-badge">{product.badge}</span>}
              </>
            )}
          </div>
          <button className={`pcard-wish ${wished ? 'active' : ''}`} onClick={handleWish} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
            <FiHeart />
          </button>
          <ProductImage src={product.images?.[0]} alt={product.name} tone={product.id} className={`pcard-img pcard-img-main ${hover ? 'has-hover' : ''}`} />
          {hover && <ProductImage src={hover} alt="" className="pcard-img pcard-img-hover" />}
          <button className="pcard-addbag" onClick={handleAdd} disabled={product.soldOut}>
            <FiShoppingBag /> {product.soldOut ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
        <div className="pcard-body">
          <p className="pcard-cat">{product.categoryLabel}</p>
          <h3 className="pcard-name">{product.name}</h3>
          <div className="pcard-rate"><FiStar /> {product.rating.toFixed(1)} <span>({product.reviews})</span></div>
          <div className="pcard-price">
            {product.salePrice ? (
              <>
                <span className="price-sale">{formatPrice(product.salePrice)}</span>
                <span className="price-old">{formatPrice(product.price)}</span>
              </>
            ) : <span className="price-sale">{formatPrice(product.price)}</span>}
          </div>
        </div>
      </Link>
    </div>
  )
}
