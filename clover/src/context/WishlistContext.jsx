import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import * as wishlistApi from '../api/wishlist'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'clover_wishlist'

function loadLocalWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [items, setItems] = useState(loadLocalWishlist)
  const mergedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isAuthenticated])

  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated && !mergedRef.current) {
      mergedRef.current = true
      ;(async () => {
        const localItems = loadLocalWishlist()
        for (const item of localItems) {
          try {
            await wishlistApi.addToWishlist(item.slug)
          } catch {
            // already wishlisted or product missing -- skip
          }
        }
        localStorage.removeItem(STORAGE_KEY)
        const remote = await wishlistApi.getWishlist()
        setItems(remote)
      })()
    }

    if (!isAuthenticated) {
      mergedRef.current = false
    }
  }, [isAuthenticated, authLoading])

  const isWishlisted = useCallback(
    (productId) => items.some((i) => (isAuthenticated ? i.productId === productId : i.id === productId)),
    [items, isAuthenticated]
  )

  const toggleWishlist = useCallback(async (product) => {
    if (isAuthenticated) {
      const existing = items.find((i) => i.productId === product.id)
      if (existing) {
        await wishlistApi.removeFromWishlist(existing.id)
        setItems((prev) => prev.filter((i) => i.id !== existing.id))
      } else {
        const added = await wishlistApi.addToWishlist(product.slug)
        setItems((prev) => [...prev, added])
      }
    } else {
      setItems((prev) => {
        const exists = prev.some((i) => i.id === product.id)
        if (exists) return prev.filter((i) => i.id !== product.id)
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.salePrice ?? product.price,
            image: product.images?.[0] ?? '',
          },
        ]
      })
    }
  }, [isAuthenticated, items])

  const removeFromWishlist = useCallback(async (id) => {
    if (isAuthenticated) {
      await wishlistApi.removeFromWishlist(id)
    }
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [isAuthenticated])

  const value = {
    items,
    count: items.length,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
