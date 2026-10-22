import React, { useState } from 'react'
import { trackOrder, apiError } from '../api/orders'
import { OrderSummary } from './OrderStatus'
import Seo from '../components/Seo'
import '../styles/Pages.css'

const FLOW = ['pending', 'confirmed', 'shipped', 'delivered']

export default function TrackOrder() {
  const [f, setF] = useState({ n: '', e: '' })
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (ev) => {
    ev.preventDefault(); setErr(''); setOrder(null); setBusy(true)
    try { setOrder(await trackOrder(f.n.trim().toUpperCase(), f.e.trim())) } catch (er) { setErr(apiError(er, 'No order found with those details.')) } finally { setBusy(false) }
  }
  const idx = order ? FLOW.indexOf(order.status) : -1

  return (
    <div className="page">
      <Seo title="Track your order" />
      <div className="wrap">
        <div className="wl-head"><h1>Track your order</h1><p>Enter the order number from your confirmation and the email you used.</p></div>
        <form className="track-card" onSubmit={submit}>
          {err && <p className="form-error">{err}</p>}
          <div className="field"><label htmlFor="on">Order number</label><input id="on" placeholder="CLV1A2B3C" value={f.n} onChange={(e) => setF({ ...f, n: e.target.value })} required /></div>
          <div className="field"><label htmlFor="oe">Email</label><input id="oe" type="email" value={f.e} onChange={(e) => setF({ ...f, e: e.target.value })} required /></div>
          <button className="btn-clover btn-block" disabled={busy}>{busy ? 'Searching…' : 'Track order'}</button>
        </form>

        {order && (
          <div className="order-card" style={{ marginTop: 36 }}>
            {order.status === 'cancelled' ? <p className="form-error">This order was cancelled.</p> : (
              <div className="steps">{['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((s, i) => <div key={s} className={i <= idx ? 'done' : ''}>{s}</div>)}</div>
            )}
            <OrderSummary order={order} />
          </div>
        )}
      </div>
    </div>
  )
}
