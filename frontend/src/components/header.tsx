import Image from 'next/image'
import Link from 'next/link'
import CartWidget from './cart-widget'
import SearchForm from './search-form'
import { Suspense } from 'react'

export default function Header() {
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

        <Link href="/" className="flex items-center gap-2 hover:underline">
          <span className="text-md">Account</span>
          <Image
            src="https://github.com/Joao-Bonifacio.png"
            className="h-7 w-7 rounded-full"
            width={24}
            height={24}
            alt=""
          />
        </Link>
      </div>
    </header>
  )
}
