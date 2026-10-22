import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams, Navigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { confirmUpi, trackOrder, apiError } from '../api/orders'
import { PhonePe, GPay, Paytm } from '../components/PaymentIcons'
import Seo from '../components/Seo'
import { useToast } from '../components/Toast'
import { formatPrice } from '../utils/formatPrice'
import { UPI_VPA, UPI_NAME, upiLink } from '../utils/shop'
import '../styles/Pages.css'

export function OrderSummary({ order }) {
  return (
    <div className="order-table">
      <h3>Order details</h3>
      <div className="order-meta">
        <div><b>Deliver to</b>{order.full_name}<br />{order.address}, {order.city}, {order.state} – {order.postal_code}<br />+91 {order.phone}</div>
        <div><b>Payment</b>{order.payment_method === 'upi' ? 'UPI' : 'Cash on Delivery'}<br /><b style={{ marginTop: 8 }}>Status</b><span className={`status-pill ${['paid', 'cod'].includes(order.payment_status) ? 'ok' : ''}`}>{{ pending: 'Awaiting payment', verification: 'Verifying payment', paid: 'Paid', cod: 'Pay on delivery', failed: 'Failed' }[order.payment_status]}</span></div>
      </div>
      {order.items.map((i, idx) => (
        <div className="sum-line" key={idx}><span>{i.product_name} × {i.qty}{i.personalization && ` (“${i.personalization}”)`}</span><span>{formatPrice(i.line_total)}</span></div>
      ))}
      <div className="sum-line"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
      {Number(order.discount) > 0 && <div className="sum-line disc"><span>Discount {order.coupon_code && `(${order.coupon_code})`}</span><span>−{formatPrice(order.discount)}</span></div>}
      <div className="sum-line"><span>Shipping</span><span>{Number(order.shipping_fee) ? formatPrice(order.shipping_fee) : 'Free'}</span></div>
      {Number(order.cod_fee) > 0 && <div className="sum-line"><span>COD handling fee</span><span>{formatPrice(order.cod_fee)}</span></div>}
      <div className="sum-total"><span>Total</span><span>{formatPrice(order.total)}</span></div>
    </div>
  )
}

export default function OrderStatus() {
  const { number } = useParams()
  const location = useLocation()
  const toast = useToast()
  const [order, setOrder] = useState(() => {
    if (location.state?.order?.order_number === number) return location.state.order
    try { const o = JSON.parse(sessionStorage.getItem('clover_last_order')); return o?.order_number === number ? o : null } catch { return null }
  })
  const [utr, setUtr] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  // Refresh latest status from the server (keeps the page truthful after admin verification).
  useEffect(() => {
    if (!order) return
    trackOrder(order.order_number, order.email).then(setOrder).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!order) return <Navigate to="/track-order" replace />

  const needsPayment = order.payment_method === 'upi' && order.payment_status === 'pending'
  const link = upiLink('upi', { amount: order.total, orderNumber: order.order_number })

  const submitUtr = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const o = await confirmUpi({ order_number: order.order_number, email: order.email, upi_ref: utr })
      setOrder(o); sessionStorage.setItem('clover_last_order', JSON.stringify(o)); toast('Payment reference received')
    } catch (er) { setErr(apiError(er)) } finally { setBusy(false) }
  }
  const copy = async () => { try { await navigator.clipboard.writeText(UPI_VPA); toast('UPI ID copied') } catch { /* ignore */ } }

  return (
    <div className="page">
      <Seo title={`Order ${order.order_number}`} />
      <div className="wrap order-card">
        <div className="order-hero">
          <div className="tick"><FiCheck /></div>
          <h1>{needsPayment ? 'Almost there — complete your payment' : 'Thank you for your order!'}</h1>
          <p>{needsPayment ? 'Your order is reserved. Pay via UPI to confirm it.' : `A confirmation will be sent to ${order.email}.`}</p>
          <span className="order-no">{order.order_number}</span>
        </div>

        {needsPayment && (
          <div className="upi-box">
            <h2>Pay with UPI</h2>
            <div className="upi-amount">{formatPrice(order.total)}</div>
            <div className="upi-apps">
              <a href={upiLink('phonepe', { amount: order.total, orderNumber: order.order_number })}><PhonePe />PhonePe</a>
              <a href={upiLink('gpay', { amount: order.total, orderNumber: order.order_number })}><GPay />Google Pay</a>
              <a href={upiLink('paytm', { amount: order.total, orderNumber: order.order_number })}><Paytm />Paytm</a>
              <a href={link} style={{ gridColumn: '1 / -1' }}>Other UPI app</a>
            </div>
            <div className="upi-qr-wrap">
              <div className="upi-qr"><QRCodeSVG value={link} size={190} level="M" /></div>
              <p className="coupon-hint" style={{ marginTop: 0 }}>Scan with any UPI app</p>
            </div>
            <div className="upi-vpa">{UPI_NAME} · {UPI_VPA} <button type="button" onClick={copy} aria-label="Copy UPI ID"><FiCopy /></button></div>
            <form className="upi-utr" onSubmit={submitUtr}>
              <ol className="upi-steps"><li>Pay exactly {formatPrice(order.total)} using the QR / buttons above.</li><li>Enter the 12-digit UPI reference (UTR) from your payment app.</li></ol>
              {err && <p className="form-error">{err}</p>}
              <div className="field"><label htmlFor="utr">UPI reference / UTR number</label><input id="utr" inputMode="numeric" maxLength={12} placeholder="12-digit number" value={utr} onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))} required /></div>
              <button className="btn-clover btn-block" disabled={busy || utr.length !== 12}>{busy ? 'Submitting…' : 'I have paid'}</button>
            </form>
          </div>
        )}

        {order.payment_status === 'verification' && <p className="form-ok">Payment reference <b>{order.upi_ref}</b> received. We're verifying it and will confirm your order shortly.</p>}
        {order.payment_status === 'cod' && <p className="form-ok">Your order is confirmed. Please keep {formatPrice(order.total)} ready at delivery.</p>}

        <OrderSummary order={order} />
        <div className="order-actions">
          <Link to="/shop/all" className="btn-clover">Continue shopping</Link>
          <Link to="/track-order" className="btn-ghost">Track order</Link>
        </div>
      </div>
    </div>
  )
}
