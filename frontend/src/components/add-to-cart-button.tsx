'use client'

import { useCart } from '@/context/cart-context'

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart()

  return (
    <button
      onClick={() => addToCart(productId)}
      type="button"
      className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 font-semibold text-white"
    >
      Add to cart
    </button>
  )
}
