import React from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Seo from '../components/Seo'
import '../styles/Pages.css'

// Template policies — have them reviewed for your business before launch.
const POLICIES = {
  shipping: { title: 'Shipping Policy', body: [
    ['Processing time', 'Orders are processed within 2–4 business days. Personalised pieces may take up to 2 extra days.'],
    ['Delivery', 'We deliver across India in 3–6 business days after dispatch. You will receive tracking details by email.'],
    ['Shipping charges', 'Shipping is free on orders over ₹999. Below that a flat fee of ₹79 applies. Cash on Delivery carries a ₹49 handling fee.'],
  ] },
  refund: { title: 'Returns & Refund Policy', body: [
    ['7-day returns', 'You may return unused items in original packaging within 7 days of delivery. Personalised pieces and earrings (for hygiene) cannot be returned.'],
    ['Damaged or wrong item', 'Contact us within 48 hours with photos and we will replace it or refund you in full.'],
    ['Refunds', 'Approved refunds are issued to your original payment method (UPI) within 5–7 business days. COD refunds are made by bank transfer.'],
  ] },
  privacy: { title: 'Privacy Policy', body: [
    ['What we collect', 'Name, email, phone number and delivery address, solely to fulfil your order and support you.'],
    ['How we use it', 'We never sell your data. It is shared only with delivery partners and payment providers needed to complete your order.'],
    ['Your choices', 'You can ask us to delete your account and data at any time through the Contact page.'],
  ] },
  terms: { title: 'Terms of Service', body: [
    ['Orders', 'An order is confirmed once payment is verified (or COD is accepted). We may cancel orders affected by pricing or stock errors and will refund any payment.'],
    ['Pricing', 'All prices are in Indian Rupees (INR) and include applicable taxes.'],
    ['Care', 'Jewellery is not water- or perfume-proof forever; please follow the care instructions provided.'],
  ] },
}

export default function Policy() {
  const { kind } = useParams()
  const p = POLICIES[kind]
  if (!p) return <Navigate to="/policy/shipping" replace />
  return (
    <div className="policy">
      <Seo title={p.title} />
      <div className="policy-tabs">
        {Object.entries(POLICIES).map(([k, v]) => <Link key={k} to={`/policy/${k}`} className={`chip ${k === kind ? 'active' : ''}`}>{v.title.replace(' Policy', '')}</Link>)}
      </div>
      <h1>{p.title}</h1>
      <p className="updated">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
      {p.body.map(([h, t]) => <section key={h}><h2>{h}</h2><p>{t}</p></section>)}
    </div>
  )
}
