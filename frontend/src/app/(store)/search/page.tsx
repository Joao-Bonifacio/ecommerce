import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import CurrentSearch from './current-search'
import { searchProducts } from '@/api/product'

interface SearchProps {
  searchParams: Promise<{
    q: string
  }>
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
        {products &&
          products.map((product) => (
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

              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between rounded-xl border border-zinc-500 bg-black/60 px-4 py-3 backdrop-blur-sm">
                <h4 className="text-blue-500 text-base font-medium truncate max-w-[70%]">
                  {product.title}
                </h4>
                <span className="rounded-full bg-violet-500 text-white px-4 py-1 text-sm font-semibold whitespace-nowrap">
                  {product.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}
