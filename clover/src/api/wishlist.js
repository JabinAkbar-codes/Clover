import client from './client'

function normalize(item) {
  return {
    id: item.id,
    productId: item.product.id,
    slug: item.product.slug,
    name: item.product.name,
    image: item.product.images?.[0] || '',
    price: Number(item.product.sale_price ?? item.product.price),
  }
}

export async function getWishlist() {
  const { data } = await client.get('/wishlist/')
  return (data.results ?? data).map(normalize)
}

export async function addToWishlist(productSlug) {
  const { data } = await client.post('/wishlist/', { product_slug: productSlug })
  return normalize(data)
}

export async function removeFromWishlist(itemId) {
  await client.delete(`/wishlist/${itemId}/`)
}
