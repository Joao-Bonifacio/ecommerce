'use client'
import { useCart } from '@/context/cart-context'
import { ShoppingCart } from 'lucide-react'

export default function CartWidget() {
  const { items } = useCart()

  return (
    <div className="flex items-center gap-2">
      <ShoppingCart className="h-5 w-5" />
      <span className="text-md">Cart ({items.length})</span>
    </div>
  )
}
