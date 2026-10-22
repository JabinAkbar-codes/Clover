import React from 'react'
import ProductRail from './ProductRail'
import useCatalog from '../hooks/useCatalog'

export default function NewArrivals() {
  const { products } = useCatalog()
  const list = products.filter((p) => p.badge === 'New' && !p.soldOut).slice(0, 12)
  return <ProductRail kicker="Just Landed" title="New Arrivals" products={list} moreTo="/shop/all?sort=newest" alt />
}
