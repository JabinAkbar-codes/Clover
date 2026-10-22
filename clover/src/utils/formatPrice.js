export function formatPrice(amount) {
  return `₹${Math.round(Number(amount) || 0).toLocaleString('en-IN')}`
}
export const discountPercent = (price, sale) => (sale && price > sale ? Math.round(((price - sale) / price) * 100) : 0)
