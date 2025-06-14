import { getFeaturedProducts } from '@/api/product'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  const products = await getFeaturedProducts()
  if (!products) return <div>Not products yet</div>

  const [highlightedProduct, ...otherProducts] = products

  return (
    <>
      {products && highlightedProduct && (
        <>
          <Link
            href={`/product/${highlightedProduct.slug}`}
            className="block group"
          >
            <Card className="overflow-hidden rounded-2xl bg-background shadow-lg hover:shadow-xl transition">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/2 aspect-[4/3] relative">
                  <Image
                    src={highlightedProduct.image}
                    alt={highlightedProduct.description}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                  />
                </div>

                <CardContent className="flex-1 p-2 text-center sm:text-left">
                  <h2 className="text-4xl font-semibold p-2">
                    {highlightedProduct.title}
                  </h2>

                  <p className="text-sm text-muted-foreground line-clamp-3 px-2 py-4">
                    {highlightedProduct.description}
                  </p>

                  <span className="inline-block bg-violet-500 text-white px-4 py-2 rounded-full text-md font-semibold mt-2 !p-5">
                    {highlightedProduct.price.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </CardContent>
              </div>
            </Card>
          </Link>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {otherProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group"
              >
                <Card className="relative rounded-2xl overflow-hidden bg-background shadow-md hover:shadow-lg transition hover:cursor-pointer">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.description}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col">
                    <div className="flex justify-between">
                      <h4 className="text-base truncate p-2 m-1.5 font-bold">
                        {product.title}
                      </h4>
                      <span className="bg-violet-500 text-white p-4.5 rounded-full text-sm font-semibold">
                        {product.price.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}
