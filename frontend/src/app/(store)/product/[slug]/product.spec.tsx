import { expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ProductPage, {
  generateStaticParams,
  generateMetadata,
} from './page'
import * as productApi from '@/app/api/product'
import { Product } from '@/app/api/validation/types/product'

vi.mock('@/components/add-to-cart-button', () => ({
  __esModule: true,
  default: ({ productId }: { productId: string }) => (
    <button>Add to Cart ({productId})</button>
  ),
}))
vi.mock('@/app/api/products')

describe('Product Page', () => {
  const mockProduct: Product = {
    id: crypto.randomUUID(),
    slug: 'product-slug',
    title: 'Mock Product',
    description: 'Mock Description',
    price: 120,
    image: '/mock.jpg',
    owner: '',
    sales: 0,
    featured: false,
    ratings: [],
  }

  const mockProducts: Product[] = [
    { ...mockProduct },
    {
      ...mockProduct,
      id: crypto.randomUUID(),
      slug: 'other-product',
      title: 'Other Product',
    },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render product details', async () => {
    vi.spyOn(productApi, 'getProduct').mockResolvedValue(mockProduct)

    render(await ProductPage({ params: { slug: 'product-slug' } }))

    await waitFor(() => {
      expect(screen.getByText('Mock Product')).toBeInTheDocument()
      expect(screen.getByText('Mock Description')).toBeInTheDocument()
      expect(screen.getByText('$120.00')).toBeInTheDocument()
      expect(screen.getByText('In 12x of $10.00')).toBeInTheDocument()
      expect(screen.getByText(/Add to Cart/)).toBeInTheDocument()
    })
  })

  it('should return null if product not found', async () => {
    vi.spyOn(productApi, 'getProduct').mockResolvedValue(null)

    const { container } = render(
      await ProductPage({ params: { slug: 'nonexistent-slug' } })
    )
    expect(container.firstChild).toBeNull()
  })

  it('generateStaticParams should return product slugs', async () => {
    vi.spyOn(productApi, 'getFeaturedProducts').mockResolvedValue(mockProducts)

    const result = await generateStaticParams()
    expect(result).toEqual([
      { slug: 'product-slug' },
      { slug: 'other-product' },
    ])
  })

  it('generateStaticParams should return null when no products', async () => {
    vi.spyOn(productApi, 'getFeaturedProducts').mockResolvedValue(null)

    const result = await generateStaticParams()
    expect(result).toBeNull()
  })

  it('generateMetadata should return title if product found', async () => {
    vi.spyOn(productApi, 'getProduct').mockResolvedValue(mockProduct)

    const metadata = await generateMetadata({ params: { slug: 'product-slug' } })
    expect(metadata).toEqual({ title: 'Mock Product' })
  })

  it('generateMetadata should return empty object if product not found', async () => {
    vi.spyOn(productApi, 'getProduct').mockResolvedValue(null)

    const metadata = await generateMetadata({ params: { slug: 'invalid' } })
    expect(metadata).toEqual({})
  })
})
