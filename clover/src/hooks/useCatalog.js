import { useEffect, useState } from 'react'
import { loadCatalog } from '../api/products'

export default function useCatalog() {
  const [state, setState] = useState({ products: [], loading: true, live: true })
  useEffect(() => {
    let active = true
    loadCatalog().then((r) => active && setState({ products: r.products, loading: false, live: r.live }))
    return () => { active = false }
  }, [])
  return state
}
