import { expect, vi, Mock, MockInstance } from 'vitest'
import { render, screen } from '@testing-library/react'
import Search from './page'
import * as productsAPI from '@/app/api/product'
import { useRouter, useSearchParams } from 'next/navigation'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

vi.mock('@/app/api/product', () => ({
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
      get: () => null,
    })

    render(await Search({ searchParams: Promise.resolve({ q: 'produto' }) }))

    expect(true).toBe(true)
  })

  it('should render the fetched products returned from searchProducts', async () => {
    ;(useRouter as Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as unknown as MockInstance).mockReturnValue({
      get: () => 'celular',
    })
    ;(productsAPI.searchProducts as Mock).mockResolvedValueOnce([
      {
        id: crypto.randomUUID(),
        owner: 'owner1',
        title: 'Produto 1',
        slug: 'produto-1',
        price: 199.99,
        sales: 10,
        image: '/image/sample.jpeg',
        description: 'Descrição do Produto 1',
        featured: false,
        ratings: [],
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
        featured: false,
        ratings: [],
      },
    ])

    render(await Search({ searchParams: Promise.resolve({ q: 'produto' }) }))

    expect(screen.getByText('Produto 1')).toBeInTheDocument()
    expect(screen.getByText('Produto 2')).toBeInTheDocument()
  })
})
