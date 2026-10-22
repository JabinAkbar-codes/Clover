import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import Reveal from './Reveal'
import ProductImage from './ProductImage'
import { COLLECTIONS } from '../utils/shop'
import '../styles/Home.css'

const IMAGES = {
  'sweet-valentina-collection': '/products/Collection1.avif',
  'autumn-collection': '/products/Collection2.avif',
  'sun-kissed-ibiza-collection': '/products/Collection3.avif',
}

export default function CollectionBanners() {
  const entries = Object.entries(COLLECTIONS)
  return (
    <section className="tiles-section" style={{ paddingTop: 80 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <p className="section-kicker">Curated</p>
          <h2 className="section-title">Our Collections</h2>
        </Reveal>
        <Swiper spaceBetween={14} breakpoints={{ 0: { slidesPerView: 1.15 }, 600: { slidesPerView: 2.1 }, 900: { slidesPerView: 3, spaceBetween: 18, allowTouchMove: false } }}>
          {entries.map(([slug, c], i) => (
            <SwiperSlide key={slug}>
              <Link to={`/collections/${slug}`} className="banner">
                <ProductImage src={IMAGES[slug]} alt={c.title} tone={i + 1} />
                <div className="banner-copy"><h3>{c.title}</h3><p>{c.tagline}</p><span>Explore</span></div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}