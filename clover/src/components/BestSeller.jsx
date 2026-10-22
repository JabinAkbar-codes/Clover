import React from 'react'
import ProductRail from './ProductRail'
import useCatalog from '../hooks/useCatalog'

export default function BestSeller() {
  const { products } = useCatalog()
  const list = products.filter((p) => p.bestseller && !p.soldOut).slice(0, 12)
  return <ProductRail kicker="Best Seller" title="Loved by Our Customers" products={list} moreTo="/shop/all" />
}
