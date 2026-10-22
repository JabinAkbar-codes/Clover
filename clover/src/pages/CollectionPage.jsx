import React, { useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import ListingPage from '../components/ListingPage'
import { COLLECTIONS } from '../utils/shop'

export default function CollectionPage() {
  const { slug } = useParams()
  const c = COLLECTIONS[slug]
  const filter = useCallback((p) => p.collection === slug, [slug])
  if (!c) return <Navigate to="/shop/all" replace />
  return <ListingPage key={slug} title={c.title} kicker="Collection" subtitle={c.blurb} filter={filter} categoryChips />
}
