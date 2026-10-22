import React from 'react'
import { FiStar } from 'react-icons/fi'
import Reveal from './Reveal'
import '../styles/Home.css'

// Sample testimonials — replace with real customer reviews before launch.
const reviews = [
  { n: 'Ananya R.', c: 'Chennai', t: 'The pearl necklace looks far more expensive than it is. Packaging was gorgeous — perfect for gifting!' },
  { n: 'Meera S.', c: 'Bengaluru', t: "I wear my Clover ring every single day and it hasn't lost its shine. Super comfortable too." },
  { n: 'Divya K.', c: 'Coimbatore', t: 'Loved the charm bracelet. Delivery was quick and paying through UPI was seamless.' },
  { n: 'Harini P.', c: 'Erode', t: 'Beautiful anklets — got so many compliments at my cousin’s wedding.' },
  { n: 'Sneha M.', c: 'Hyderabad', t: 'Great quality for the price, and the personalised initial charm was a hit with my sister.' },
  { n: 'Keerthana V.', c: 'Madurai', t: 'Built my own necklace with three charms — it arrived beautifully packed and looks stunning.' },
  { n: 'Priya L.', c: 'Mumbai', t: 'The earrings are so light I forget I am wearing them. Already ordered a second pair!' },
  { n: 'Nandhini T.', c: 'Salem', t: 'Easy returns and friendly support. Honestly my favourite jewellery store right now.' },
]

function Card({ r, hidden }) {
  return (
    <div className="review-card" aria-hidden={hidden || undefined}>
      <div className="review-stars">{[0, 1, 2, 3, 4].map((i) => <FiStar key={i} />)}</div>
      <p>“{r.t}”</p>
      <div className="review-by"><strong>{r.n}</strong>{r.c} · Verified buyer</div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="reviews-section">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="section-kicker">Love Notes</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </Reveal>
      </div>
      <div className="marquee" aria-label="Customer reviews">
        <div className="marquee-track">
          {reviews.map((r) => <Card key={r.n} r={r} />)}
          {reviews.map((r) => <Card key={`${r.n}-dup`} r={r} hidden />)}
        </div>
      </div>
    </section>
  )
}
