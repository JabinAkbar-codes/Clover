import React, { useMemo } from 'react'
import ListingPage from '../components/ListingPage'
import useCatalog from '../hooks/useCatalog'
import { discountPercent } from '../utils/formatPrice'

const filter = (p) => Boolean(p.salePrice) && !p.soldOut

export default function SalePage() {
  const { products } = useCatalog()
  const stats = useMemo(() => {
    const on = products.filter(filter)
    return { count: on.length, max: Math.max(0, ...on.map((p) => discountPercent(p.price, p.salePrice))) }
  }, [products])

  const hero = stats.count > 0 && (
    <div className="sale-hero">
      <div className="sale-stat"><b><span className="sale-pulse" />{stats.count}</b><span>Pieces on offer</span></div>
      <div className="sale-stat"><b>Up to {stats.max}%</b><span>Off today</span></div>
    </div>
  )

  return (
    <ListingPage
      title="Sale"
      kicker="Limited time"
      subtitle="Only our offer pieces — special prices while stocks last."
      filter={filter}
      categoryChips
      sortOptions={['discount']}
      hero={hero}
    />
  )
}
