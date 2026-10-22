import React, { useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import ListingPage from '../components/ListingPage'
import { CATEGORIES } from '../utils/shop'

const BLURBS = {
  necklaces: 'Delicate chains, pearls and pendants — made for layering.',
  bracelets: 'Stack them, mix them, make them yours.',
  earrings: 'From everyday studs to statement drops.',
  rings: 'Minimal bands and sparkling stackers.',
  anklets: 'Delicate chains and beads made for bare feet and summer days.',
  charms: 'Tiny pieces with big stories. Add them to any chain.',
}

export default function CategoryPage() {
  const { slug } = useParams()
  const isAll = slug === 'all'
  const cat = CATEGORIES.find((c) => c.slug === slug)
  const filter = useCallback((p) => isAll || p.category === slug, [isAll, slug])
  if (!isAll && !cat) return <Navigate to="/shop/all" replace />
  return (
    <ListingPage
      key={slug}
      title={isAll ? 'All Jewellery' : cat.label}
      kicker={isAll ? 'Shop' : 'Shop by category'}
      subtitle={isAll ? 'Everything in the CLOVER collection.' : BLURBS[slug]}
      filter={filter}
      categoryChips={isAll}
      searchable={isAll}
      layout={slug === 'charms' ? 'compact' : 'sidebar'}
      cardVariant={slug === 'charms' ? 'simple' : 'default'}
      defaultLabel={slug === 'charms' ? 'Best selling' : 'Featured'}
    />
  )
}
