'use client'
import React from 'react'
import { useCart } from '@/context/cart-context'

export default function CartPage() {
  const { items, removeFromCart, clearCart, updateQuantity } = useCart()
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 h-[84vh]">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p>Add some products to start shopping!</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 h-[84vh] overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>

      <ul className="divide-y divide-gray-300 mb-6">
        {items.map(({ id, title, price, quantity }) => (
          <li key={id} className="flex justify-between items-center py-4">
            <div>
              <h2 className="font-semibold">{title}</h2>
              <p>R$ {price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`quantity-${id}`} className="sr-only">
                Ammount of {title}
              </label>
              <input
                id={`quantity-${id}`}
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value >= 1) updateQuantity(id, value)
                }}
                className="w-16 border rounded px-2 py-1 text-center"
              />
              <button
                onClick={() => removeFromCart(id)}
                className="text-red-600 hover:text-red-800"
                aria-label={`Remove ${title} from cart`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center font-bold text-lg mb-6">
        <span>Total:</span>
        <span>
          R${' '}
          {total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear cart
        </button>
        <button
          name="purchase"
          onClick={() => alert('Checkout not implemented yet')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Finalize purchase
        </button>
      </div>
    </div>
  )
}
