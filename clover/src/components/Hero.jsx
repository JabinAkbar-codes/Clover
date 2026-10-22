import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Hero.css'
import leftImg from '../assets/hero-left.avif'
import centerImg from '../assets/hero-center.avif'
import rightImg from '../assets/hero-right.avif'

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-panel">
          <img src={leftImg} alt="Luxury jewelry left" className="hero-img" />
        </div>

        <div className="hero-panel hero-center-panel">
          <img src={centerImg} alt="Clover luxury center" className="hero-img" />

          <div className="hero-overlay-card">
            <p className="hero-kicker">New Collection</p>
            <h1 className="hero-title">Sweet Valentina Collection</h1>
            <p className="hero-subtitle">Romantic. Elegant. Feminine.</p>
            <Link to="/collections/sweet-valentina-collection" className="hero-btn">
              SHOP COLLECTION
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <img src={rightImg} alt="Luxury jewelry right" className="hero-img" />
        </div>
      </div>
    </section>
  )
}