import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import 'swiper/css/free-mode'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ProductCard from './ProductCard'
import Reveal from './Reveal'
import '../styles/Home.css'

// Swiper-powered product row: swipe on phones/tablets, arrows on desktop.
export default function ProductRail({ kicker, title, products, moreTo, moreLabel = 'View More', alt = false }) {
  const [sw, setSw] = useState(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  if (!products?.length) return null
  const sync = (s) => setEdge({ start: s.isBeginning, end: s.isEnd })

  return (
    <section className={`rail-section ${alt ? 'alt' : ''}`}>
      <div className="wrap">
        <Reveal className="rail-head">
          <div>
            {kicker && <p className="rail-kicker">{kicker}</p>}
            <h2 className="rail-title">{title}</h2>
          </div>
          <div className="rail-nav">
            <button onClick={() => sw?.slidePrev()} disabled={edge.start} aria-label="Previous"><FiChevronLeft /></button>
            <button onClick={() => sw?.slideNext()} disabled={edge.end} aria-label="Next"><FiChevronRight /></button>
          </div>
        </Reveal>

        <Swiper
          modules={[FreeMode, Navigation]}
          onSwiper={(s) => { setSw(s); sync(s) }}
          onSlideChange={sync}
          onResize={sync}
          freeMode={{ enabled: true, sticky: false }}
          spaceBetween={16}
          className="rail-swiper"
          breakpoints={{
            0: { slidesPerView: 1.6, spaceBetween: 12 },
            480: { slidesPerView: 2.2, spaceBetween: 14 },
            768: { slidesPerView: 3.2, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20, freeMode: { enabled: false } },
            1500: { slidesPerView: 5, spaceBetween: 20, freeMode: { enabled: false } },
          }}
        >
          {products.map((p, i) => (
            <SwiperSlide key={p.id}><ProductCard product={p} index={i} /></SwiperSlide>
          ))}
        </Swiper>

        {moreTo && <div className="rail-more"><Link to={moreTo} className="btn-ghost">{moreLabel}</Link></div>}
      </div>
    </section>
  )
}
