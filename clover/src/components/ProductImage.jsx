import React from 'react'
import logo from '../assets/logo.svg'

// Shows the real photo when a path/URL is set, otherwise an elegant blank placeholder.
// Add real photos later by putting files in /public/products and listing them in the product's
// "images" field in the Django admin (e.g. /products/ring-1.jpg).
export default function ProductImage({ src, alt = '', className = '', eager = false, tone = 0 }) {
  if (src) return <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  return (
    <div className={`ph ph-${tone % 4} ${className}`} role="img" aria-label={alt ? `${alt} (image coming soon)` : 'Image placeholder'}>
      <img src={logo} alt="" aria-hidden="true" />
    </div>
  )
}
