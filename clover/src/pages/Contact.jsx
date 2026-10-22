import React, { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiClock, FiChevronDown } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import { sendContact, apiError } from '../api/orders'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import '../styles/Pages.css'
import '../styles/Contact.css'

const info = [
  { icon: <FiMail />, t: 'Email', s: 'support@clover.example', href: 'mailto:support@clover.example' },
  { icon: <FiPhone />, t: 'Phone', s: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: <FaWhatsapp />, t: 'WhatsApp', s: 'Chat with us', href: 'https://wa.me/919876543210' },
  { icon: <FiMapPin />, t: 'Studio', s: 'Erode, Tamil Nadu, India' },
  { icon: <FiClock />, t: 'Hours', s: 'Mon–Sat, 10am – 7pm IST' },
]

const faqs = [
  ['How long does delivery take?', 'Orders ship in 2–4 business days and arrive within 3–6 business days across India. Free shipping on orders over ₹999.'],
  ['Can I return or exchange an item?', 'Yes — unused items in original packaging can be returned within 7 days. Personalised pieces and earrings are not returnable.'],
  ['Which payment methods do you accept?', 'UPI (PhonePe, Google Pay, Paytm and more) and Cash on Delivery with a ₹49 handling fee.'],
  ['How do I care for my jewellery?', 'Keep it dry, store it in the pouch provided and apply perfume before wearing it.'],
]

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '' })
  const [state, setState] = useState({ busy: false, ok: '', err: '' })
  const [open, setOpen] = useState(0)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault(); setState({ busy: true, ok: '', err: '' })
    try { const r = await sendContact(f); setState({ busy: false, ok: r.detail, err: '' }); setF({ name: '', email: '', phone: '', message: '' }) }
    catch (er) { setState({ busy: false, ok: '', err: apiError(er) }) }
  }

  return (
    <div className="ct">
      <Seo title="Contact" />
      <div className="static-hero"><h1>Contact us</h1><p>Questions about an order, sizing or gifting? We'd love to help.</p></div>

      <div className="wrap">
        <div className="ct-cards">
          {info.map((i, k) => {
            const Tag = i.href ? 'a' : 'div'
            return (
              <Reveal key={i.t} delay={k * 0.06} className="ct-card-wrap">
                <Tag className="ct-card" {...(i.href ? { href: i.href, target: i.href.startsWith('http') ? '_blank' : undefined, rel: 'noreferrer' } : {})}>
                  <span className="ct-ico">{i.icon}</span>
                  <b>{i.t}</b>
                  <span className="ct-val">{i.s}</span>
                </Tag>
              </Reveal>
            )
          })}
        </div>

        <div className="ct-main">
          <Reveal className="ct-side">
            <p className="section-kicker">Say hello</p>
            <h2>We'd love to hear from you</h2>
            <p>Send us a message and our team will reply within 24 hours. For anything urgent about an order, WhatsApp is the fastest way to reach us.</p>
            <ul className="ct-points">
              <li>Replies within 24 hours</li>
              <li>Help with sizing &amp; gifting</li>
              <li>Order &amp; delivery support</li>
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="ct-form" onSubmit={submit}>
              {state.ok && <p className="form-ok">{state.ok}</p>}
              {state.err && <p className="form-error">{state.err}</p>}
              <div className="row-2">
                <div className="field"><label htmlFor="cn">Name</label><input id="cn" value={f.name} onChange={set('name')} required /></div>
                <div className="field"><label htmlFor="ce">Email</label><input id="ce" type="email" value={f.email} onChange={set('email')} required /></div>
              </div>
              <div className="field"><label htmlFor="cp">Phone (optional)</label><input id="cp" inputMode="tel" value={f.phone} onChange={set('phone')} /></div>
              <div className="field"><label htmlFor="cm">Message</label><textarea id="cm" value={f.message} onChange={set('message')} required /></div>
              <button className="btn-clover btn-block" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send message'}</button>
            </form>
          </Reveal>
        </div>

        <Reveal className="ct-faq">
          <h2>Frequently asked</h2>
          {faqs.map(([q, a], i) => (
            <div key={q} className={`ct-q ${open === i ? 'open' : ''}`}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{q}<FiChevronDown /></button>
              <AnimatePresence initial={false}>
                {open === i && <motion.div className="ct-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}><p>{a}</p></motion.div>}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  )
}
