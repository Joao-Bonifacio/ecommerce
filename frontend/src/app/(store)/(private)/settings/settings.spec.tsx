import { render, screen, fireEvent } from '@testing-library/react'
import SettingsPage from './page'
import * as userAPI from '@/api/user'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { waitFor } from '@/__test__/utils/whait-for'

vi.mock('@/api/user', () => ({
  getCurrentUser: vi.fn(),
  updateAvatar: vi.fn(),
  updatePassword: vi.fn(),
}))

describe('SettingsPage', () => {
  const mockGetCurrentUser = vi.mocked(userAPI.getCurrentUser)
  const mockUpdatePassword = vi.mocked(userAPI.updatePassword)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user info and upgrade button for non-PLATINUM level', async () => {
    mockGetCurrentUser.mockResolvedValueOnce({
      nickname: 'john_doe',
      avatar: '/avatar.jpg',
      level: 'GOLD',
      id: '',
      name: '',
      email: '',
      role: 'CUSTUMER',
    })

    render(await SettingsPage())

    expect(
      screen.getByRole('button', { name: /upgrade plan/i }),
    ).toBeInTheDocument()
  })

  it('does not render upgrade button for PLATINUM level', async () => {
    mockGetCurrentUser.mockResolvedValueOnce({
      nickname: 'platinum_user',
      avatar: '/avatar.jpg',
      level: 'PLATINUM',
      id: '',
      name: '',
      email: '',
      role: 'CUSTUMER',
    })

    render(await SettingsPage())

    expect(
      screen.queryByRole('button', { name: /upgrade plan/i }),
    ).not.toBeInTheDocument()
  })

  it('submits password update form', async () => {
    mockGetCurrentUser.mockResolvedValueOnce({
      nickname: 'john_doe',
      avatar: '/avatar.jpg',
      level: 'GOLD',
      id: '',
      name: '',
      email: '',
      role: 'CUSTUMER',
    })

    mockUpdatePassword.mockResolvedValueOnce(undefined)

    render(await SettingsPage())

    const inputs = screen.getAllByPlaceholderText(/password/i)
    fireEvent.change(inputs[0], { target: { value: 'oldpassword' } })
    fireEvent.change(inputs[1], { target: { value: 'newpassword' } })

    const savePasswordButton = screen.getByRole('button', {
      name: /save password/i,
    })
    fireEvent.click(savePasswordButton)

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalled()
    })
  })
})
