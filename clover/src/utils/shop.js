// Keep in sync with clover_backend/orders/pricing.py (server re-calculates everything anyway).
export const FREE_SHIPPING_THRESHOLD = 999
export const SHIPPING_FEE = 79
export const COD_FEE = 49

export const UPI_VPA = import.meta.env.VITE_UPI_VPA || 'yourname@okhdfcbank'
export const UPI_NAME = import.meta.env.VITE_UPI_NAME || 'CLOVER'

export const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
]

export const CATEGORIES = [
  { slug: 'necklaces', label: 'Necklaces', image: '/AllProducts/Necklace.avif' },
  { slug: 'bracelets', label: 'Bracelets', image: '/AllProducts/Bracelet.avif' },
  { slug: 'earrings',  label: 'Earrings',  image: '/AllProducts/Earrings.avif' },
  { slug: 'rings',     label: 'Rings',     image: '/AllProducts/Rings.avif' },
  { slug: 'anklets',   label: 'Anklets',   image: '/AllProducts/Anklets.avif' },
  { slug: 'charms',    label: 'Charms',    image: '/AllProducts/Charms.avif' },
]

export const COLLECTIONS = {
  'sweet-valentina-collection': { title: 'Sweet Valentina Collection', tagline: 'Romantic. Elegant. Feminine.', blurb: 'Soft hearts, blush tones and pearl details — pieces made for the ones you love.' },
  'autumn-collection': { title: 'Autumn Collection', tagline: 'Warm tones for golden days.', blurb: 'Layered textures and amber-warm finishes that glow against cosy knits.' },
  'sun-kissed-ibiza-collection': { title: 'Sun Kissed Ibiza Collection', tagline: 'Summer, all year round.', blurb: 'Sea-glass shimmer and sunlit gold. Now at special prices.' },
}

export function upiLink(scheme, { amount, orderNumber }) {
  const q = new URLSearchParams({ pa: UPI_VPA, pn: UPI_NAME, am: Number(amount).toFixed(2), cu: 'INR', tn: `CLOVER ${orderNumber}`, tr: orderNumber })
  const qs = q.toString()
  if (scheme === 'phonepe') return `phonepe://pay?${qs}`
  if (scheme === 'gpay') return `tez://upi/pay?${qs}`
  if (scheme === 'paytm') return `paytmmp://pay?${qs}`
  return `upi://pay?${qs}`
}
