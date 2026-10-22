import client from './client'

export const createOrder = (payload) => client.post('/orders/', payload).then((r) => r.data)
export const fetchOrders = () => client.get('/orders/').then((r) => r.data)
export const trackOrder = (order_number, email) => client.get('/orders/track/', { params: { order_number, email } }).then((r) => r.data)
export const confirmUpi = (payload) => client.post('/orders/confirm-upi/', payload).then((r) => r.data)
export const validateCoupon = (code, subtotal) => client.post('/coupons/validate/', { code, subtotal }).then((r) => r.data)
export const sendContact = (payload) => client.post('/contact/', payload).then((r) => r.data)
export const subscribe = (email) => client.post('/newsletter/', { email }).then((r) => r.data)

export function apiError(err, fallback = 'Something went wrong. Please try again.') {
  const d = err?.response?.data
  if (!d) return err?.code === 'ERR_NETWORK' ? 'Cannot reach the server. Please check your connection.' : fallback
  if (typeof d === 'string') return fallback
  if (d.detail) return d.detail
  const first = Object.values(d)[0]
  return Array.isArray(first) ? first[0] : typeof first === 'string' ? first : fallback
}
