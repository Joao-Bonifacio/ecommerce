import Image from 'next/image'
import Link from 'next/link'
import CartWidget from './cart-widget'
import SearchForm from './search-form'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { ThemeToggle } from './theme-toggle'

export default async function Header() {
  const token = (await cookies()).get('access_token')

  return (
    <header className="flex items-center justify-between !p-4">
      <div className="flex items-center gap-5">
        <Link href="/" className="text-2xl font-extrabold text-white">
          Ecommerce
        </Link>

        <Suspense fallback={null}>
          <SearchForm />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
        <CartWidget />

        <div className="w-px h-4 bg-zinc-700" />
        <ThemeToggle />

        {token && (
          <Link
            href="/settings"
            className="flex items-center gap-2 hover:underline"
          >
            <span className="text-md">Account</span>
            <Image
              src="https://i.pravatar.cc/101"
              className="h-7 w-7 rounded-full"
              width={24}
              height={24}
              alt="avatar"
            />
          </Link>
        )}
      </div>
    </header>
  )
}
