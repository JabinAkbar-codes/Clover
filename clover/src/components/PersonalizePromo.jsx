import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import ProductImage from './ProductImage'
import '../styles/Home.css'

export default function PersonalizePromo() {
  return (
    <section className="promo-section">
      <div className="promo-media">
        <ProductImage src="/products/Hero1.avif" alt="Personalize your jewellery with charms" tone={1} />
      </div>
      <Reveal className="promo-copy">
        <h2>Personalize It — Make It Yours</h2>
        <p>Pick your favourite necklace, bracelet or pair of earrings and mix in a charm or two. A lovely way to gift, or to add a bit of your own story to something you already wear every day.</p>
        <p>Play with combinations until it feels like you.</p>
        <Link to="/shop/charms" className="btn-clover">Charms</Link>
      </Reveal>
    </section>
  )
}