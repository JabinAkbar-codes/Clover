import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiAward, FiPackage, FiPenTool, FiSearch, FiTool, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import ProductImage from '../components/ProductImage'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import Seo from '../components/Seo'
import useCatalog from '../hooks/useCatalog'
import '../styles/About.css'

const steps = [
  { icon: <FiPenTool />, t: 'Design', s: 'Every piece starts as a sketch — soft shapes made to be layered and worn daily.' },
  { icon: <FiSearch />, t: 'Source', s: 'We choose skin-safe, nickel-free metals, freshwater pearls and glass beads.' },
  { icon: <FiTool />, t: 'Handcraft', s: 'Small-batch finishing by skilled hands, with an anti-tarnish coating.' },
  { icon: <FiCheckCircle />, t: 'Quality check', s: 'Each item is inspected, polished and packed in a CLOVER gift box.' },
]

const values = [
  { icon: <FiAward />, t: 'Quality first', s: 'Hypoallergenic, nickel-free and finished to last.' },
  { icon: <FiHeart />, t: 'Designed with love', s: 'Timeless shapes with a modern, feminine touch.' },
  { icon: <FiPackage />, t: 'Gift ready', s: 'Every order arrives in a signature CLOVER gift box.' },
]

export default function About() {
  const { products } = useCatalog()
  const designs = products.length || 149

  return (
    <div className="ab">
      <Seo title="About" />

      {/* Hero */}
      <section className="ab-hero">
        <div className="wrap ab-hero-grid">
          <div className="ab-hero-copy">
            <motion.p className="section-kicker" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>Our story</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }}>Jewellery for <em>everyday</em> luxury</motion.h1>
            <motion.p className="ab-lead" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }}>
              CLOVER began with a simple idea: beautiful jewellery shouldn't wait for special occasions. Every piece is designed to slip into your daily life — to work, to dinner, and everywhere in between.
            </motion.p>
            <motion.div className="ab-cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.7 }}>
              <Link to="/shop/all" className="btn-clover">Shop all jewellery</Link>
              <Link to="/personalize" className="btn-ghost">Personalize yours</Link>
            </motion.div>
          </div>
          <div className="ab-hero-art" aria-hidden="true">
            <motion.div className="ab-art a1" animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><ProductImage src="/products/Hero1.avif" tone={1} /></motion.div>
            <motion.div className="ab-art a2" animate={{ y: [0, 14, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}><ProductImage src="/products/Hero2.avif" tone={2} /></motion.div>
            <span className="ab-orb o1" /><span className="ab-orb o2" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="ab-stats">
        <div className="wrap ab-stats-grid">
          <Reveal className="ab-stat"><b><CountUp to={designs} /></b><span>Handcrafted designs</span></Reveal>
          <Reveal delay={0.08} className="ab-stat"><b><CountUp to={6} /></b><span>Jewellery categories</span></Reveal>
          <Reveal delay={0.16} className="ab-stat"><b><CountUp to={7} suffix="-day" /></b><span>Easy returns</span></Reveal>
          <Reveal delay={0.24} className="ab-stat"><b><CountUp to={100} suffix="%" /></b><span>Skin-safe finishes</span></Reveal>
        </div>
      </section>

      {/* Story blocks */}
      <section className="wrap ab-story">
        <Reveal className="ab-block">
          <div className="ab-block-media"><ProductImage src="/AllProducts/Necklace.avif" alt="Our necklaces" tone={1} /></div>
          <div className="ab-block-copy">
            <p className="section-kicker">The craft</p>
            <h2>Small batches, made with care</h2>
            <p>We design in limited runs, using skin-safe metals and anti-tarnish finishes so each piece keeps its glow for longer. From pearls to glass beads, every detail is chosen to feel light, comfortable and quietly luxurious.</p>
            <Link to="/shop/necklaces" className="ab-link">Explore necklaces <FiArrowRight /></Link>
          </div>
        </Reveal>
        <Reveal className="ab-block rev">
          <div className="ab-block-media"><ProductImage src="/AllProducts/Charms.avif" alt="Personalised charms" tone={2} /></div>
          <div className="ab-block-copy">
            <p className="section-kicker">Made personal</p>
            <h2>Your story, one charm at a time</h2>
            <p>From engraved initials to mix-and-match charms, we love pieces that say something about you. Build a necklace that is entirely your own, or choose the perfect gift for someone special.</p>
            <Link to="/personalize" className="ab-link">Start personalizing <FiArrowRight /></Link>
          </div>
        </Reveal>
      </section>

      {/* Process */}
      <section className="ab-process">
        <div className="wrap">
          <Reveal className="section-head"><p className="section-kicker">How it's made</p><h2 className="section-title">From sketch to your doorstep</h2></Reveal>
          <div className="ab-steps">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.1} className="ab-step">
                <span className="ab-step-n">0{i + 1}</span>
                <span className="ab-step-ico">{s.icon}</span>
                <h3>{s.t}</h3>
                <p>{s.s}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ribbon */}
      <div className="ab-ribbon" aria-hidden="true">
        <div className="ab-ribbon-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>Skin-safe ✦ Anti-tarnish ✦ Nickel-free ✦ Gift ready ✦ Free shipping over ₹999 ✦ UPI &amp; COD ✦ </span>
          ))}
        </div>
      </div>

      {/* Values */}
      <section className="wrap ab-values">
        {values.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.1} className="ab-value"><span>{v.icon}</span><h3>{v.t}</h3><p>{v.s}</p></Reveal>
        ))}
      </section>

      {/* CTA */}
      <section className="ab-final">
        <Reveal>
          <h2>Find the piece that feels like you</h2>
          <p>New arrivals every week — and free shipping on orders over ₹999.</p>
          <Link to="/shop/all?sort=newest" className="btn-clover">See what's new</Link>
        </Reveal>
      </section>
    </div>
  )
}
