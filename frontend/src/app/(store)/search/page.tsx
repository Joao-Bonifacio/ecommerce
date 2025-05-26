import { api } from '@/data/api'
import { type Product } from '@/data/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import CurrentSearch from './current-search'

interface SearchProps {
  searchParams: {
    q: string
  }
}

async function searchProducts(query: string): Promise<Product[]> {
  const response = await api(`/products/search?q=${query}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })
  const products = await response.json()

  return products
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = await searchParams

  if (!query) redirect('/')

  const products = await searchProducts(query)

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={null}>
        <CurrentSearch />
      </Suspense>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end group relative"
          >
            <Image
              src={product.image}
              className="group-hover:scale-105 transition-transform duration-500"
              width={480}
              height={480}
              quality={100}
              alt=""
            />

            <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
              <span className="text-sm truncate">{product.title}</span>
              <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
                {product.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
