import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SignUpPage from './page'

describe('SignUpPage - UI', () => {
  it('renders the title', () => {
    render(<SignUpPage />)
    expect(screen.getByText(/create your account/i)).toBeInTheDocument()
  })

  it('renders all input fields', () => {
    render(<SignUpPage />)
    expect(screen.getByPlaceholderText('your name...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('repeat password')).toBeInTheDocument()
  })

  it('renders the register button', () => {
    render(<SignUpPage />)
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })
})
