import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { signIn, signUp } from '@/app/api/user'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { mockUser } from '@/__test__/mocks/user.mock'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const mockSetUser = vi.fn()
vi.mock('@/context/stores/user-store', () => ({
  useUserStore: {
    getState: () => ({
      setUser: mockSetUser,
    }),
  },
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

  it('should sign-up successfully with valid form data and set user in store', async () => {
    const form = new FormData()
    form.set('name', 'John Doe')
    form.set('email', 'john@example.com')
    form.set('nickname', 'john_doe')
    form.set('password', '@Passw0rd')
    form.set('confirm-password', '@Passw0rd')

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token', user: mockUser }),
    } as Response)

    await expect(signUp(form)).resolves.toBeUndefined()

    expect(mockSet).toHaveBeenCalledWith('access_token', 'mock-token')
    expect(mockSetUser).toHaveBeenCalledWith(mockUser)
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

  it('should sign-in with email successfully and set user in store', async () => {
    const form = new FormData()
    form.set('email', 'test@test.com')
    form.set('password', '@Passw0rd')

    const mockUser = {
      id: '123',
      name: 'John Doe',
      nickname: 'john_doe',
      email: 'john@example.com',
      level: 'BRONZE',
      role: 'CUSTUMER',
    }

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token', user: mockUser }),
    } as Response)

    await expect(signIn(form)).resolves.toBeUndefined()

    expect(mockSet).toHaveBeenCalledWith('access_token', 'mock-token')
    expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should sign-in with nickname successfully and set user in store', async () => {
    const form = new FormData()
    form.set('nickname', 'john_doe')
    form.set('password', '@Passw0rd')

    const mockUser = {
      id: '123',
      name: 'John Doe',
      nickname: 'john_doe',
      email: 'john@example.com',
      level: 'BRONZE',
      role: 'CUSTUMER',
    }

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token', user: mockUser }),
    } as Response)

    await expect(signIn(form)).resolves.toBeUndefined()

    expect(mockSet).toHaveBeenCalledWith('access_token', 'mock-token')
    expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    expect(redirect).toHaveBeenCalledWith('/')
  })
})
