import { useEffect } from 'react'

export default function Seo({ title }) {
  useEffect(() => { document.title = title ? `${title} — CLOVER` : 'CLOVER — Handcrafted Jewellery' }, [title])
  return null
}
