import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, CartState } from '@/types/order'
import { Product } from '@/types/product'

type Action =
  | { type: 'ADD_ITEM'; product: Product; quantity: number; variation?: CartItem['selectedVariation'] }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] }

function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = parseFloat(item.selectedVariation?.price ?? item.product.price ?? '0')
    return sum + price * item.quantity
  }, 0)
}

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex(i => i.product.id === action.product.id)
      const items = idx >= 0
        ? state.items.map((item, i) => i === idx ? { ...item, quantity: item.quantity + action.quantity } : item)
        : [...state.items, { product: action.product, quantity: action.quantity, selectedVariation: action.variation }]
      return { items, total: calcTotal(items), itemCount: items.reduce((s, i) => s + i.quantity, 0) }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.product.id !== action.productId)
      return { items, total: calcTotal(items), itemCount: items.reduce((s, i) => s + i.quantity, 0) }
    }
    case 'UPDATE_QTY': {
      const items = state.items.map(i => i.product.id === action.productId ? { ...i, quantity: action.quantity } : i).filter(i => i.quantity > 0)
      return { items, total: calcTotal(items), itemCount: items.reduce((s, i) => s + i.quantity, 0) }
    }
    case 'CLEAR_CART': return { items: [], total: 0, itemCount: 0 }
    case 'LOAD_CART': {
      const items = action.items
      return { items, total: calcTotal(items), itemCount: items.reduce((s, i) => s + i.quantity, 0) }
    }
    default: return state
  }
}

const CartContext = createContext<{
  state: CartState
  addItem: (product: Product, quantity: number, variation?: CartItem['selectedVariation']) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, quantity: number) => void
  clearCart: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 })
  useEffect(() => {
    try {
      const saved = localStorage.getItem('oo_cart')
      if (saved) dispatch({ type: 'LOAD_CART', items: JSON.parse(saved) })
    } catch {}
  }, [])
  useEffect(() => {
    localStorage.setItem('oo_cart', JSON.stringify(state.items))
  }, [state.items])
  return (
    <CartContext.Provider value={{
      state,
      addItem: (product, quantity, variation) => dispatch({ type: 'ADD_ITEM', product, quantity, variation }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
      updateQty: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', productId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
