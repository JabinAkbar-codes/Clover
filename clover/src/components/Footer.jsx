import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook } from 'react-icons/fi'
import { RiPinterestLine } from 'react-icons/ri'
import PaymentIcons from './PaymentIcons'
import { subscribe, apiError } from '../api/orders'
import logo from '../assets/logo.svg'
import '../styles/Footer.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ busy: false, msg: '', ok: false })

  const submit = async (e) => {
    e.preventDefault()
    setState({ busy: true, msg: '', ok: false })
    try {
      await subscribe(email)
      setState({ busy: false, msg: 'Thanks for subscribing! Your 10% code: WELCOME10', ok: true })
      setEmail('')
    } catch (err) {
      setState({ busy: false, msg: apiError(err, 'Please enter a valid email.'), ok: false })
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-news">
        <h3>Subscribe to our emails</h3>
        <p>Be first to know about new drops and get 10% off your first order.</p>
        <form onSubmit={submit} className="news-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Email address" />
          <button type="submit" disabled={state.busy} aria-label="Subscribe">&rarr;</button>
        </form>
        {state.msg && <p className="news-msg" style={{ color: state.ok ? 'var(--ok)' : 'var(--danger)' }}>{state.msg}</p>}
      </div>

      <div className="wrap">
        <div className="footer-cols">
          <div className="footer-col brand">
            <div className="footer-brand"><img src={logo} alt="" /> CLOVER</div>
            <p className="footer-about">Handcrafted jewellery designed for everyday luxury — made to be layered, gifted and loved.</p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest"><RiPinterestLine /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop/necklaces">Necklaces</Link></li>
              <li><Link to="/shop/bracelets">Bracelets</Link></li>
              <li><Link to="/shop/earrings">Earrings</Link></li>
              <li><Link to="/shop/rings">Rings</Link></li>
              <li><Link to="/shop/anklets">Anklets</Link></li>
              <li><Link to="/shop/charms">Charms</Link></li>
              <li><Link to="/shop/all">All Jewellery</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Customer care</h4>
            <ul>
              <li><Link to="/track-order">Track your order</Link></li>
              <li><Link to="/account/orders">My orders</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/policy/shipping">Shipping policy</Link></li>
              <li><Link to="/policy/refund">Returns &amp; refunds</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Discover</h4>
            <ul>
              <li><Link to="/about">About CLOVER</Link></li>
              <li><Link to="/personalize">Personalize</Link></li>
              <li><Link to="/sale">Sale</Link></li>
              <li><Link to="/collections/sweet-valentina-collection">Sweet Valentina</Link></li>
              <li><Link to="/collections/autumn-collection">Autumn Collection</Link></li>
              <li><Link to="/collections/sun-kissed-ibiza-collection">Sun Kissed Ibiza</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-region">Country/region: India | INR ₹</div>
          <div className="footer-pay"><PaymentIcons /></div>
        </div>
        <div className="footer-legal">
          <span>&copy; {new Date().getFullYear()} CLOVER</span>
          <Link to="/policy/privacy">Privacy Policy</Link>
          <Link to="/policy/refund">Refund Policy</Link>
          <Link to="/policy/terms">Terms of Service</Link>
          <Link to="/policy/shipping">Shipping Policy</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
