/* eslint-disable camelcase */
'use server'

import { api } from '@/app/api/api-wrapper'
import { validate } from './validation/zod-validate'
import { signInSchema, signUpSchema } from './validation/session-validate'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { userSchema } from './validation/user.validate'
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
  if (!validation.success) return validation

  const { access_token, user } = await api('/session/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(upload),
  }).then((data) => data.json())
  if (!access_token) return null

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
  if (!validation.success) return validation

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
