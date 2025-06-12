/* eslint-disable camelcase */
'use server'
import { api } from '@/app/api/api-wrapper'
import { validate } from './validation/zod-validate'
import { signInSchema, signUpSchema } from './validation/session-validate'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { updatePasswordSchema, userSchema } from './validation/user.validate'
import { useUserStore } from '@/context/stores/user-store'
import { User } from './validation/types/user'

const setUserInStore = (user: User) => {
  const parsed = userSchema.safeParse(user)
  if (parsed.success) {
    useUserStore.getState().setUser(parsed.data)
  } else {
    console.error('Invalid user data from API', parsed.error)
  }
}

export const signUp = async (data: FormData): Promise<unknown | null> => {
  if (data.get('password') !== data.get('confirm-password')) {
    return null
  }
  const upload = {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password'),
  }
  const validation = validate(upload, signUpSchema)
  if (!validation.success) return validation.errors

  const { access_token, user } = await api('/session/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(upload),
  }).then((data) => data.json())
  if (!access_token) throw new Error('Failed to sign-up')

  const cookie = await cookies()
  cookie.set('access_token', access_token)

  setUserInStore(user)

  return redirect('/')
}

export const signIn = async (data: FormData): Promise<unknown> => {
  const upload = data.get('email')
    ? { email: data.get('email'), password: data.get('password') }
    : { nickname: data.get('nickname'), password: data.get('password') }
  const validation = validate(upload, signInSchema)
  if (!validation.success) return validation.errors

  const { access_token, user } = await api('/session/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(upload),
  }).then((data) => data.json())
  if (!access_token) throw new Error('Failed to sign-in')

  const cookie = await cookies()
  cookie.set('access_token', access_token)

  setUserInStore(user)

  return redirect('/')
}

export const signOut = async (): Promise<void> => {
  const cookie = await cookies()
  cookie.set('access_token', '', { maxAge: -1 })
  useUserStore.getState().setUser(null)
  return redirect('/')
}

export const getCurrentUser = async (): Promise<User> => {
  const token = (await cookies()).get('access_token')
  if (!token) throw new Error('Unauthorized')

  const user = await api('/session/current', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json())
  if (!user) throw new Error('Failed to fetch user')

  setUserInStore(user)
  return user
}

export const updateAvatar = async (
  fileName: string,
  file: File,
): Promise<unknown> => {
  const formData = new FormData()
  formData.append('avatar', file)
  formData.append('fileName', fileName)

  const token = (await cookies()).get('access_token')
  if (!token) throw new Error('Unauthorized')

  const user = await api('/settings/avatar', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => res.json())

  if (!user) throw new Error('Failed to update avatar')

  setUserInStore(user)
  return redirect('/settings')
}

export const updatePassword = async (data: FormData): Promise<unknown> => {
  const upload = {
    currentPassword: data.get('current-password'),
    newPassword: data.get('new-password'),
  }
  const validation = validate(upload, updatePasswordSchema)
  const token = (await cookies()).get('access_token')

  if (!token || !validation.success) throw new Error('Unauthorized')

  const response = await api('/settings/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(upload),
  })
  if (!response.ok) throw new Error('Failed to update password')

  return redirect('/settings')
}

export const deleteAccount = async (): Promise<void> => {
  const token = (await cookies()).get('access_token')
  if (!token) throw new Error('Unauthorized')

  const response = await api('/settings/delete-account', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) throw new Error('Failed to delete account')

  useUserStore.getState().setUser(null)
  return redirect('/')
}
