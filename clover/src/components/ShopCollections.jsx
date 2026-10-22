import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import Reveal from './Reveal'
import ProductImage from './ProductImage'
import { CATEGORIES } from '../utils/shop'
import '../styles/Home.css'

export default function ShopCollections() {
  return (
    <section className="tiles-section">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="section-kicker">Browse</p>
          <h2 className="section-title">Shop Collections</h2>
        </Reveal>
        <Swiper
          spaceBetween={14}
          breakpoints={{
            0: { slidesPerView: 1.5 },
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1100: { slidesPerView: 6, spaceBetween: 16 },
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <SwiperSlide key={cat.slug}>
              <Link to={`/shop/${cat.slug}`} className="tile">
                <div className="tile-media"><ProductImage src={cat.image} alt={cat.label} tone={i} /></div>
                <span className="tile-label">{cat.label} <span className="arrow">&rarr;</span></span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
