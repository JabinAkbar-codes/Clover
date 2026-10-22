import React from 'react'
import { FiTruck, FiRefreshCw, FiShield, FiSmartphone } from 'react-icons/fi'
import '../styles/Home.css'

const items = [
  { icon: <FiTruck />, t: 'Free Shipping', s: 'On orders over ₹999' },
  { icon: <FiSmartphone />, t: 'UPI & COD', s: 'Pay the way you like' },
  { icon: <FiRefreshCw />, t: 'Easy Returns', s: '7-day hassle-free' },
  { icon: <FiShield />, t: 'Quality Promise', s: 'Skin-safe & anti-tarnish' },
]

export default function TrustBar() {
  return (
    <section className="trust">
      <div className="wrap">
        <div className="trust-grid">
          {items.map((i) => (
            <div className="trust-item" key={i.t}>{i.icon}<div><strong>{i.t}</strong><span>{i.s}</span></div></div>
          ))}
        </div>
      </div>
    </section>
  )
}
