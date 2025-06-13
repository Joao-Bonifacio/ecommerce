'use client'
import { useState } from 'react'
import { useCart } from '@/context/cart-context'
import { Check, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AddToCartButton({
  id,
  title,
  price,
}: {
  id: string
  title: string
  price: number
}) {
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addToCart(id, title, price)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      type="button"
      disabled={isLoading}
      aria-label="Add product to cart"
      className={cn(
        'cursor-pointer hover:underline mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-white font-semibold transition-all',
        'hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2',
        isLoading && 'cursor-not-allowed opacity-75',
      )}
    >
      {isAdded ? (
        <>
          <Check className="h-5 w-5" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {isLoading ? 'Adding...' : 'Add to cart'}
        </>
      )}
    </button>
  )
}
