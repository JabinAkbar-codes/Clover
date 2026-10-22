import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchOrders } from '../api/orders'
import { formatPrice } from '../utils/formatPrice'
import Seo from '../components/Seo'
import '../styles/Pages.css'

export default function MyOrders() {
  const { isAuthenticated, loading } = useAuth()
  const [orders, setOrders] = useState(null)
  useEffect(() => { if (isAuthenticated) fetchOrders().then(setOrders).catch(() => setOrders([])) }, [isAuthenticated])

  if (loading) return <div className="page" />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/account/orders' }} replace />

  return (
    <div className="page">
      <Seo title="My orders" />
      <div className="wrap">
        <div className="wl-head"><h1>My orders</h1></div>
        {orders === null ? <p style={{ textAlign: 'center' }}>Loading…</p> : orders.length === 0 ? (
          <div className="empty-state"><h3>No orders yet</h3><Link to="/shop/all" className="btn-clover">Start shopping</Link></div>
        ) : (
          <div className="orders-list">
            {orders.map((o) => (
              <Link key={o.order_number} to={`/order/${o.order_number}`} state={{ order: o }} className="order-row">
                <div><strong>{o.order_number}</strong><br /><small>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.items.length} item(s)</small></div>
                <div style={{ textAlign: 'right' }}><strong>{formatPrice(o.total)}</strong><br /><span className="status-pill">{o.status}</span></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
