'use client'
import { type ReactNode, createContext, useContext, useState } from 'react'

interface CartItem {
  id: string
  quantity: number
  title: string
  price: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (id: string, title: string, price: number) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  function addToCart(id: string, title: string, price: number) {
    setCartItems((state) => {
      const productInCart = state.some((item) => item.id === id)
      if (productInCart) {
        return state.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
      } else {
        return [...state, { id, title, quantity: 1, price }]
      }
    })
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return
    setCartItems((state) =>
      state.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  function removeFromCart(id: string) {
    setCartItems((state) => state.filter((item) => item.id !== id))
  }

  function clearCart() {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{ items: cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
