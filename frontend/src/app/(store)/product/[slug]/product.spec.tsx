import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as productApi from '@/app/api/product'
import ProductPage, { generateMetadata, generateStaticParams } from './page'
import { mockProduct } from '@/__test__/mocks/product.mock'

vi.mock('@/components/add-to-cart-button', () => ({
  default: () => <button>Add to cart mock</button>,
}))

describe('ProductPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('generateMetadata', () => {
    it('returns metadata with title when product found', async () => {
      vi.spyOn(productApi, 'getProduct').mockResolvedValue(mockProduct)

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: mockProduct.slug }),
      })

      expect(metadata.title).toBe(mockProduct.title)
    })

    it('returns empty object when product not found', async () => {
      vi.spyOn(productApi, 'getProduct').mockResolvedValue(null)

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'not-found' }),
      })

      expect(metadata).toEqual({})
    })
  })

  describe('generateStaticParams', () => {
    it('returns list of product slugs', async () => {
      const products = [mockProduct]
      vi.spyOn(productApi, 'getFeaturedProducts').mockResolvedValue(products)

      const params = await generateStaticParams()

      expect(params).toEqual([{ slug: mockProduct.slug }])
    })

    it('returns null when no products', async () => {
      vi.spyOn(productApi, 'getFeaturedProducts').mockResolvedValue(null)

      const params = await generateStaticParams()

      expect(params).toBeNull()
    })
  })

  describe('ProductPage component', () => {
    it('renders product details when product found', async () => {
      vi.spyOn(productApi, 'getProduct').mockResolvedValue(mockProduct)

      const { container } = render(
        await ProductPage({
          params: Promise.resolve({ slug: mockProduct.slug }),
        }),
      )

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /mock product/i }),
        ).toBeInTheDocument()
        expect(screen.getByText(/this is a mock product/i)).toBeInTheDocument()
        expect(screen.getByText('$120.00')).toBeInTheDocument()
        expect(screen.getByText(/in 12x of \$10.00/i)).toBeInTheDocument()
        expect(screen.getByText(/add to cart mock/i)).toBeInTheDocument()
      })

      expect(container).toMatchSnapshot()
    })

    it('returns null when product not found', async () => {
      vi.spyOn(productApi, 'getProduct').mockResolvedValue(null)

      const { container } = render(
        await ProductPage({
          params: Promise.resolve({ slug: 'not-found' }),
        }),
      )

      expect(container.firstChild).toBeNull()
    })
  })
})
