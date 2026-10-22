import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import ProductImage from './ProductImage'
import '../styles/Home.css'

export default function MakeYourOwnPromo() {
  return (
    <section className="promo-section promo-reverse">
      <Reveal className="promo-copy">
        <h2>Make Your Own Jewelry</h2>
        <p>Build something one-of-a-kind by choosing from our range of charms and chains. No tools, no mess — just an easy way to design a piece that's entirely your own.</p>
        <Link to="/personalize" className="btn-clover">Shop</Link>
      </Reveal>
      <div className="promo-media">
        <ProductImage src="/products/Hero2.avif" alt="Make your own jewellery with charms" tone={2} />
      </div>
    </section>
  )
}