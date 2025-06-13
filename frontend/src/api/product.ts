'use server'
import { api } from '@/api/api-wrapper'
import type { Product } from './validation/types/product'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { validate } from './validation/zod-validate'
import { productFormSchema } from './validation/product-validate'

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
  const products = await api(`/products/search?q=${query}`, {
    method: 'GET',
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  }).then((data) => data.json())

  if (!Array.isArray(products)) return null

  return products
}

// seller

export const getMyProducts = async (): Promise<Product[]> => {
  const token = (await cookies()).get('access_token')
  if (!token) throw new Error('Unauthorized')

  const products = await api('/seller/my-products', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  }).then((data) => data.json())

  return products
}

export const createProduct = async (data: FormData): Promise<void> => {
  const token = (await cookies()).get('access_token')
  const validation = validate(data, productFormSchema)
  if (!token || !validation) throw new Error('Unauthorized')

  const response = await api('/seller/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
    next: {
      tags: ['products'],
    },
  })

  if (!response.ok) {
    throw new Error('Failed to create product')
  }

  revalidateTag('products')
}
