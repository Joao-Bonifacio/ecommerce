'use server'
import { api } from '@/app/api/api-wrapper'
import type { Product } from './validation/types/product'
import { env } from '@/env'

export const getProduct = async (slug: string): Promise<Product | null> => {
  const product = await api(`/products/slug/${slug}`, {
    method: 'GET',
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  }).then((data) => data.json())
  if (!product) throw new Error('Cannot find product')
  return product
}

export const getFeaturedProducts = async (): Promise<Product[] | null> => {
  const products = await api('/products/featured', {
    method: 'GET',
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  }).then((data) => data.json())
  if (!products) return null
  return products
}

export const searchProducts = async (
  query: string,
): Promise<Product[] | null> => {
  const url = new URL('/v1/products/search', env.NEXT_PUBLIC_API_BASE_URL)
  url.searchParams.set('q', query)

  const products = await fetch(url, {
    method: 'GET',
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  }).then((data) => data.json())

  if (!Array.isArray(products)) return null

  return products
}
