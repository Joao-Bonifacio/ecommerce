import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'
import { getFeaturedProducts } from '@/utils/products'
import { mockProducts } from '@/__test__/mocks/products'

vi.mock('@/utils/products', () => ({
  getFeaturedProducts: vi.fn(),
}))

describe('Home page', () => {
  beforeEach(() => {
    vi.mocked(
      getFeaturedProducts as ReturnType<typeof vi.fn>,
    ).mockResolvedValue(mockProducts)
  })

  it('should render features products', async () => {
    render(await Home())

    expect(screen.getByText('Highlight Product')).toBeInTheDocument()
    expect(screen.getByText('$999')).toBeInTheDocument()

    expect(screen.getByText('Second Product')).toBeInTheDocument()
    expect(screen.getByText('$499')).toBeInTheDocument()

    expect(screen.getByText('Third Product')).toBeInTheDocument()
    expect(screen.getByText('$299')).toBeInTheDocument()
  })
})
