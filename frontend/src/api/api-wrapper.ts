import { env } from '@/env'
import { RequestInit } from 'next/dist/server/web/spec-extension/request'

export const api = (path: string, init?: RequestInit) => {
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL
  const url = new URL(baseUrl)

  url.pathname = `/v1${path.startsWith('/') ? path : `/${path}`}`

  return fetch(url.toString(), init)
}
