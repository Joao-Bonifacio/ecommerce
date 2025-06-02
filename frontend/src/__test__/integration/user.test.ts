import { describe, it, expect, beforeEach, Mock } from 'vitest'
import { signIn, signUp } from '@/app/api/user'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// mocks helpers
const mockSet = vi.fn()
const mockCookies = {
  set: mockSet,
}
;(cookies as unknown as Mock).mockReturnValue(mockCookies)

describe('User API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should sign up successfully with valid form data', async () => {
    const form = new FormData()
    form.set('name', 'John Doe')
    form.set('email', 'john@example.com')
    form.set('password', '123456')
    form.set('confirm-password', '123456')

    const result = await signUp(form)
    expect(mockSet).toHaveBeenCalledWith('access_token', expect.any(String))
    expect(redirect).toHaveBeenCalledWith('/')
    expect(result).toBeUndefined()
  })

  it('should fail sign up with mismatched passwords', async () => {
    const form = new FormData()
    form.set('name', 'John Doe')
    form.set('email', 'john@example.com')
    form.set('password', '123456')
    form.set('confirm-password', 'wrongpass')

    const result = await signUp(form)
    expect(result).toBeNull()
  })

  it('should sign in with email and password', async () => {
    const form = new FormData()
    form.set('email', 'john@example.com')
    form.set('password', '123456')

    const result = await signIn(form)
    expect(mockSet).toHaveBeenCalledWith('access_token', expect.any(String))
    expect(redirect).toHaveBeenCalledWith('/')
    expect(result).toBeUndefined()
  })

  it('should sign in with nickname and password', async () => {
    const form = new FormData()
    form.set('nickname', 'johndoe')
    form.set('password', '123456')

    const result = await signIn(form)
    expect(mockSet).toHaveBeenCalledWith('access_token', expect.any(String))
    expect(redirect).toHaveBeenCalledWith('/')
    expect(result).toBeUndefined()
  })
})
