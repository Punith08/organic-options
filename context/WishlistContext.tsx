import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product } from '@/types/product'

interface WishlistState { items: Product[]; count: number }
type Action =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; productId: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: Product[] }

function reducer(state: WishlistState, action: Action): WishlistState {
  switch (action.type) {
    case 'ADD': {
      if (state.items.find(i => i.id === action.product.id)) return state
      const items = [...state.items, action.product]
      return { items, count: items.length }
    }
    case 'REMOVE': {
      const items = state.items.filter(i => i.id !== action.productId)
      return { items, count: items.length }
    }
    case 'CLEAR': return { items: [], count: 0 }
    case 'LOAD': return { items: action.items, count: action.items.length }
    default: return state
  }
}

const WishlistContext = createContext<{
  items: Product[]
  count: number
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
} | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], count: 0 })
  useEffect(() => {
    try {
      const saved = localStorage.getItem('oo_wishlist')
      if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) })
    } catch {}
  }, [])
  useEffect(() => {
    localStorage.setItem('oo_wishlist', JSON.stringify(state.items))
  }, [state.items])
  return (
    <WishlistContext.Provider value={{
      items: state.items,
      count: state.count,
      addToWishlist: (product) => dispatch({ type: 'ADD', product }),
      removeFromWishlist: (productId) => dispatch({ type: 'REMOVE', productId }),
      isInWishlist: (productId) => state.items.some(i => i.id === productId),
      clearWishlist: () => dispatch({ type: 'CLEAR' }),
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
