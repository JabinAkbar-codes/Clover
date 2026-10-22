import React, { useState, useRef } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { FiLock, FiCheck } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder, validateCoupon, apiError } from '../api/orders'
import ProductImage from '../components/ProductImage'
import { PhonePe, GPay, Paytm, CashIcon, Razorpay } from '../components/PaymentIcons'
import Seo from '../components/Seo'
import { formatPrice } from '../utils/formatPrice'
import { COD_FEE, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, STATES } from '../utils/shop'
import '../styles/Pages.css'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const placedRef = useRef(false) // stops the empty-bag redirect firing after a successful order
  const [error, setError] = useState('')
  const [fieldErr, setFieldErr] = useState({})
  const [method, setMethod] = useState('upi')
  const [coupon, setCoupon] = useState({ input: '', code: '', discount: 0, msg: '' })
  const [form, setForm] = useState({
    full_name: user?.first_name || '', email: user?.email || '', phone: '', address: '', city: '', state: 'Tamil Nadu', postal_code: '',
  })

  const discount = coupon.discount
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const cod = method === 'cod' ? COD_FEE : 0
  const total = subtotal - discount + shipping + cod

  const set = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setFieldErr({ ...fieldErr, [e.target.name]: '' }) }

  const validate = () => {
    const e = {}
    if (form.full_name.trim().length < 2) e.full_name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.address.trim().length < 5) e.address = 'Enter your full address'
    if (!form.city.trim()) e.city = 'Enter your city'
    if (!/^[1-9]\d{5}$/.test(form.postal_code)) e.postal_code = 'Enter a valid 6-digit PIN code'
    setFieldErr(e)
    return Object.keys(e).length === 0
  }

  const applyCoupon = async () => {
    const code = coupon.input.trim().toUpperCase()
    if (!code) return
    try {
      const r = await validateCoupon(code, subtotal)
      setCoupon({ input: '', code: r.code, discount: Number(r.discount), msg: '' })
    } catch (err) {
      setCoupon((c) => ({ ...c, msg: apiError(err, 'Invalid coupon code.') }))
    }
  }

  // Re-validate the applied coupon if the bag changes.
  const couponStale = coupon.code && coupon.discount > subtotal

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) { setError('Please fix the highlighted fields.'); return }
    setBusy(true)
    try {
      const order = await createOrder({
        ...form, payment_method: method, coupon_code: couponStale ? '' : coupon.code,
        items: items.map((i) => ({ slug: i.slug, qty: i.qty, personalization: i.personalization || '' })),
      })
      sessionStorage.setItem('clover_last_order', JSON.stringify(order))
      placedRef.current = true
      clearCart()
      navigate(`/order/${order.order_number}`, { state: { order }, replace: true })
    } catch (err) {
      setError(apiError(err, 'We could not place your order. Please try again.'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally { setBusy(false) }
  }

  const E = ({ k }) => (fieldErr[k] ? <span className="err">{fieldErr[k]}</span> : null)
  if (items.length === 0 && !placedRef.current) return <Navigate to="/shop/all" replace />

  return (
    <div className="page">
      <Seo title="Checkout" />
      <div className="wrap">
        <h1 className="co-title">Checkout</h1>
        {!isAuthenticated && (
          <p className="guest-note">Checking out as a guest. <Link to="/login" state={{ from: '/checkout' }}>Log in</Link> to save your orders &amp; wishlist.</p>
        )}

        <form className="co-grid" onSubmit={submit} noValidate>
          <div>
            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="co-card">
              <h2><span className="num">1</span> Contact</h2>
              <div className="row-2">
                <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={set} /><E k="email" /></div>
                <div className="field"><label htmlFor="phone">Mobile number</label><input id="phone" name="phone" inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="10-digit number" value={form.phone} onChange={(e) => set({ target: { name: 'phone', value: e.target.value.replace(/\D/g, '') } })} /><E k="phone" /></div>
              </div>
            </div>

            <div className="co-card">
              <h2><span className="num">2</span> Delivery address</h2>
              <div className="field"><label htmlFor="full_name">Full name</label><input id="full_name" name="full_name" autoComplete="name" value={form.full_name} onChange={set} /><E k="full_name" /></div>
              <div className="field"><label htmlFor="address">Address</label><input id="address" name="address" autoComplete="street-address" placeholder="House no., street, area" value={form.address} onChange={set} /><E k="address" /></div>
              <div className="row-2">
                <div className="field"><label htmlFor="city">City</label><input id="city" name="city" autoComplete="address-level2" value={form.city} onChange={set} /><E k="city" /></div>
                <div className="field"><label htmlFor="postal_code">PIN code</label><input id="postal_code" name="postal_code" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.postal_code} onChange={(e) => set({ target: { name: 'postal_code', value: e.target.value.replace(/\D/g, '') } })} /><E k="postal_code" /></div>
              </div>
              <div className="row-2">
                <div className="field"><label htmlFor="state">State</label>
                  <select id="state" name="state" value={form.state} onChange={set}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
                <div className="field"><label>Country</label><input value="India" disabled /></div>
              </div>
            </div>

            <div className="co-card">
              <h2><span className="num">3</span> Payment</h2>
              <div className="pay-options" role="radiogroup" aria-label="Payment method">
                <label className={`pay-opt ${method === 'upi' ? 'on' : ''}`}>
                  <input type="radio" name="pm" checked={method === 'upi'} onChange={() => setMethod('upi')} />
                  <span><strong>UPI</strong><small>Scan a QR or pay with PhonePe, Google Pay, Paytm &amp; more</small></span>
                  <span className="pay-icons"><span className="pay-chip"><PhonePe /></span><span className="pay-chip"><GPay /></span><span className="pay-chip"><Paytm /></span></span>
                </label>
                <label className={`pay-opt ${method === 'cod' ? 'on' : ''}`}>
                  <input type="radio" name="pm" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                  <span><strong>Cash on Delivery</strong><small>Pay when your order arrives (+{formatPrice(COD_FEE)} handling fee)</small></span>
                  <span className="pay-icons"><span className="pay-chip"><CashIcon /></span></span>
                </label>
                <label className="pay-opt disabled" title="Enabled once Razorpay keys are added">
                  <input type="radio" disabled />
                  <span><strong>Cards &amp; Net Banking</strong><small>Coming soon</small></span>
                  <span className="pay-icons"><span className="pay-chip"><Razorpay /></span></span>
                </label>
              </div>
              {method === 'upi' && <p className="coupon-hint" style={{ marginTop: 12 }}>You'll see the UPI QR code &amp; payment buttons right after placing your order.</p>}
            </div>
          </div>

          <aside className="co-summary">
            <h2>Order summary</h2>
            {items.map((i) => (
              <div className="sum-item" key={i.key}>
                <div className="sum-img"><span className="q">{i.qty}</span><ProductImage src={i.image} alt={i.name} tone={i.id} /></div>
                <p>{i.name}{i.personalization && <><br /><small>“{i.personalization}”</small></>}</p>
                <strong>{formatPrice(i.price * i.qty)}</strong>
              </div>
            ))}

            {coupon.code && !couponStale ? (
              <div className="coupon-applied"><span><FiCheck /> {coupon.code} applied</span><button type="button" onClick={() => setCoupon({ input: '', code: '', discount: 0, msg: '' })}>Remove</button></div>
            ) : (
              <>
                <div className="coupon-row">
                  <input placeholder="Coupon code" value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, msg: '' })} aria-label="Coupon code" />
                  <button type="button" onClick={applyCoupon}>Apply</button>
                </div>
                <p className="coupon-hint" style={coupon.msg ? { color: 'var(--danger)' } : null}>{coupon.msg || 'Try WELCOME10 for 10% off.'}</p>
              </>
            )}

            <div style={{ marginTop: 12 }}>
              <div className="sum-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="sum-line disc"><span>Discount</span><span>−{formatPrice(discount)}</span></div>}
              <div className="sum-line"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              {cod > 0 && <div className="sum-line"><span>COD handling fee</span><span>{formatPrice(cod)}</span></div>}
              <div className="sum-total"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>

            <button type="submit" className="btn-clover btn-block co-submit" disabled={busy}>
              {busy ? 'Placing order…' : method === 'upi' ? `Place order & pay ${formatPrice(total)}` : `Place order — ${formatPrice(total)}`}
            </button>
            <div className="co-secure"><FiLock /> Your details are encrypted &amp; never shared.</div>
          </aside>
        </form>
      </div>
    </div>
  )
}
