import { expect, vi, it, describe, beforeEach, MockInstance } from 'vitest'
import { render, screen } from '@testing-library/react'
import Search from './page'
import * as productsAPI from '@/api/product'
import { useRouter, useSearchParams, redirect } from 'next/navigation'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
  redirect: vi.fn(),
}))

vi.mock('@/api/product', () => ({
  searchProducts: vi.fn(),
}))

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to / if query is undefined', async () => {
    ;(useRouter as unknown as MockInstance).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as unknown as MockInstance).mockReturnValue({
      get: () => redirect('/'),
    })

    render(await Search({ searchParams: Promise.resolve({ q: '' }) }))

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should render products when query is provided', async () => {
    ;(useRouter as unknown as MockInstance).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as unknown as MockInstance).mockReturnValue({
      get: () => 'celular',
    })

    const mockedProductsAPI = vi.mocked(productsAPI)

    mockedProductsAPI.searchProducts.mockResolvedValueOnce([
      {
        id: crypto.randomUUID(),
        owner: 'owner1',
        title: 'Produto 1',
        slug: 'produto-1',
        price: 199.99,
        sales: 10,
        image: '/image/sample.jpeg',
        description: 'Descrição do Produto 1',
        featured: true,
        ratings: [],
        stock: 0,
      },
      {
        id: crypto.randomUUID(),
        owner: 'owner2',
        title: 'Produto 2',
        slug: 'produto-2',
        price: 299.99,
        sales: 5,
        image: '/image/sample.jpeg',
        description: 'Descrição do Produto 2',
        featured: true,
        ratings: [],
        stock: 0,
      },
    ])

    render(await Search({ searchParams: Promise.resolve({ q: 'produto' }) }))

    expect(await screen.findByText('Produto 1')).toBeInTheDocument()
    expect(screen.getByText('Produto 2')).toBeInTheDocument()
  })
})
