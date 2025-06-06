import { render, screen, waitFor } from '@testing-library/react'
import * as productApi from '@/app/api/product'
import Home from './page'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Product } from '@/app/api/validation/types/product'

vi.mock('@/app/api/product', () => ({
  getFeaturedProducts: vi.fn(),
}))

describe('Home - Integration', () => {
  const mockProducts: Product[] = [
    {
      id: crypto.randomUUID(),
      slug: 'highlighted-product',
      title: 'Highlighted Product',
      description: 'This is a highlighted product.',
      price: 199.99,
      image: '/highlighted.jpg',
      owner: '',
      sales: 0,
      featured: false,
      ratings: [],
    },
    {
      id: crypto.randomUUID(),
      slug: 'second-product',
      title: 'Second Product',
      description: 'Another product',
      price: 99.99,
      image: '/second.jpg',
      owner: '',
      sales: 0,
      featured: false,
      ratings: [],
    },
    {
      id: crypto.randomUUID(),
      slug: 'third-product',
      title: 'Third Product',
      description: 'Yet another product',
      price: 59.99,
      image: '/third.jpg',
      owner: '',
      sales: 0,
      featured: false,
      ratings: [],
    },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders highlighted product and others', async () => {
    vi.spyOn(productApi, 'getFeaturedProducts').mockResolvedValue(mockProducts)

    render(await Home())

    await waitFor(() => {
      expect(screen.getByText('Highlighted Product')).toBeInTheDocument()
      expect(screen.getByText('This is a highlighted product.')).toBeInTheDocument()
      expect(screen.getByText('$199.99')).toBeInTheDocument()
    })

    expect(screen.getByText('Second Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('Third Product')).toBeInTheDocument()
    expect(screen.getByText('$59.99')).toBeInTheDocument()
  })

  it('renders nothing if no products', async () => {
    vi.spyOn(productApi, 'getFeaturedProducts').mockResolvedValue(null)

    const { container } = render(await Home())
    expect(container.firstChild).toBeNull()
  })
})
