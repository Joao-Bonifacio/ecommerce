import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartPage from './page'
import * as CartContext from '@/context/cart-context'
import { vi, beforeEach, describe, it, expect } from 'vitest'

describe('CartPage', () => {
  const mockRemoveFromCart = vi.fn()
  const mockClearCart = vi.fn()
  const mockUpdateQuantity = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  type CartItem = { id: string; title: string; price: number; quantity: number }

  function renderWithCart(items: CartItem[] = []) {
    vi.spyOn(CartContext, 'useCart').mockReturnValue({
      items,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      updateQuantity: mockUpdateQuantity,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      addToCart: function (id: string, title: string, price: number): void {
        throw new Error('Function not implemented.')
      },
    })
    render(<CartPage />)
  }

  it('should render empty cart message when no items', () => {
    renderWithCart([])
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
    expect(
      screen.getByText(/add some products to start shopping/i),
    ).toBeInTheDocument()
  })

  it('should render cart items and total correctly', () => {
    const items = [
      { id: '1', title: 'Product 1', price: 10, quantity: 2 },
      { id: '2', title: 'Product 2', price: 5, quantity: 1 },
    ]
    renderWithCart(items)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()

    expect(screen.getByText(/total:/i)).toBeInTheDocument()
    expect(screen.getByText(/\$25\.00|R\$ 25\.00/)).toBeInTheDocument()
  })

  it('should call updateQuantity when quantity input changes', async () => {
    const user = userEvent.setup()
    const items = [{ id: '1', title: 'Product 1', price: 10, quantity: 2 }]
    renderWithCart(items)

    const input = screen.getByLabelText(/Ammount of Product 1/i)
    await user.clear(input)
    await user.type(input, '3')

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 23)
  })

  it('should call removeFromCart when remove button clicked', async () => {
    const user = userEvent.setup()
    const items = [{ id: '1', title: 'Product 1', price: 10, quantity: 2 }]
    renderWithCart(items)

    const button = screen.getByRole('button', {
      name: /remove product 1 from cart/i,
    })
    await user.click(button)

    expect(mockRemoveFromCart).toHaveBeenCalledWith('1')
  })

  it('should call clearCart when clear cart button clicked', async () => {
    const user = userEvent.setup()
    const items = [{ id: '1', title: 'Product 1', price: 10, quantity: 2 }]
    renderWithCart(items)

    const button = screen.getByRole('button', { name: /clear cart/i })
    await user.click(button)

    expect(mockClearCart).toHaveBeenCalled()
  })
})
