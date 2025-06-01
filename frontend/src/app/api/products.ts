'use server'
import { api } from '@/app/api/api-wrapper'
import type { Product } from './validation/types/product'

export const getProduct = async (slug: string): Promise<Product | null> => {
  const product = await api(`/products/${slug}`, {
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
  const products = await api(`/products/search?q=${query}`, {
    method: 'GET',
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  }).then((data) => data.json())
  if (!products) return null
  return products
}
