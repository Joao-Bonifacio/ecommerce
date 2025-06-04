import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SignInPage from './page'

describe('SignInPage - UI', () => {
  it('renders the title', () => {
    render(<SignInPage />)
    expect(screen.getByText(/loggin to your account/i)).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    render(<SignInPage />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your password')).toBeInTheDocument()
  })

  it('renders the login button', () => {
    render(<SignInPage />)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})
