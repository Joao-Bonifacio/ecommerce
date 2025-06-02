import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { signIn, signUp } from '@/app/api/user'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('User API Integration', () => {
  let mockSet: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mockSet = vi.fn()
    ;(cookies as unknown as Mock).mockReturnValue({
      set: mockSet,
    })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'mock-token' }),
    } as Response)
  })

  it('should sign-up successfully with valid form data', async () => {
    const form = new FormData()
    form.set('name', 'John Doe')
    form.set('email', 'john@example.com')
    form.set('nickname', 'john_doe')
    form.set('password', '@Passw0rd')
    form.set('confirm-password', '@Passw0rd')
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token' }),
    } as Response)

    await expect(signUp(form)).resolves.toBeUndefined()

    expect(mockSet).toHaveBeenCalledWith('access_token', 'mock-token')
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should fail sign-up with mismatched passwords', async () => {
    const form = new FormData()
    form.set('name', 'John Doe')
    form.set('email', 'john@example.com')
    form.set('nickname', 'john_doe')
    form.set('password', '@Passw0rd')
    form.set('confirm-password', 'wrongpass')

    const result = await signUp(form)

    expect(result).toBeNull()
  })

  it('should sign-in with email and password', async () => {
    const form = new FormData()
    form.set('email', 'test@test.com')
    form.set('password', '@Passw0rd')
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token' }),
    } as Response)

    await expect(signIn(form)).resolves.toBeUndefined()

    expect(mockSet).toHaveBeenCalledWith('access_token', 'mock-token')
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should sign-in with nickname and password', async () => {
    const form = new FormData()
    form.set('nickname', 'john_dee')
    form.set('password', '@Passw0rd')
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token' }),
    } as Response)

    await expect(signIn(form)).resolves.toBeUndefined()

    expect(mockSet).toHaveBeenCalledWith('access_token', 'mock-token')
    expect(redirect).toHaveBeenCalledWith('/')
  })
})
