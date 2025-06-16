import { render, screen } from '@testing-library/react'
import SellerPannel from './page'
import * as productAPI from '@/api/product'
import { vi, it, describe, expect } from 'vitest'

vi.mock('@/api/product', () => ({
  getMyProducts: vi.fn(),
}))

describe('SellerPannel', () => {
  const mockGetMyProducts = vi.mocked(productAPI.getMyProducts)

  const mockProducts = [
    {
      id: '1',
      owner: 'owner1',
      title: 'Product 1',
      slug: 'product-1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      sales: 5,
      image: '/image1.jpg',
      featured: false,
      ratings: [],
    },
    {
      id: '2',
      owner: 'owner2',
      title: 'Product 2',
      slug: 'product-2',
      description: 'Description 2',
      price: 50,
      stock: 3,
      sales: 2,
      image: '/image2.jpg',
      featured: false,
      ratings: [],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders products list and sales summary', async () => {
    mockGetMyProducts.mockResolvedValueOnce(mockProducts)

    render(await SellerPannel())

    expect(screen.getByText(/list - \(2\)/i)).toBeInTheDocument()

    expect(screen.getByText(/product 1 - \(10\)/i)).toBeInTheDocument()
    expect(screen.getByText(/description 1/i)).toBeInTheDocument()
    expect(screen.getByText(/product 2 - \(3\)/i)).toBeInTheDocument()
    expect(screen.getByText(/description 2/i)).toBeInTheDocument()

    expect(screen.getByText(/sales - \(7\)/i)).toBeInTheDocument()
    const totalEarnings = 100 * 5 + 50 * 2
    expect(screen.getByText(`$${totalEarnings.toFixed(2)}`)).toBeInTheDocument()

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent(/product 1/i)
    expect(items[1]).toHaveTextContent(/product 2/i)
  })

  it('renders correctly with empty product list', async () => {
    mockGetMyProducts.mockResolvedValueOnce([])

    render(await SellerPannel())

    expect(screen.getByText(/list - \(0\)/i)).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.getByText(/sales - \(0\)/i)).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })
})
