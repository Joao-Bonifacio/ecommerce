import { getProduct, getFeaturedProducts } from '@/api/product'
import type { Rate } from '@/api/validation/types/product'
import AddToCartButton from '@/components/add-to-cart-button'
import type { Metadata } from 'next'
import Image from 'next/image'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return { title: product.title }
}

export async function generateStaticParams() {
  const products = await getFeaturedProducts()
  if (!products) return []
  return products.map((product) => ({
    slug: product.slug,
  }))
}

const getStarsAverage = (ratings: Rate[]): number | null => {
  if (!Array.isArray(ratings) || ratings.length === 0) return null

  const totalStars = ratings.reduce((sum, rate) => sum + rate.stars, 0)
  const average = totalStars / ratings.length

  return Number(average.toFixed(1))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return null
  const starsAverage = getStarsAverage(product.ratings)

  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image
          className="rounded-r-xl"
          src={product.image}
          alt={product.description}
          width={1000}
          height={1000}
          quality={100}
        />
      </div>

      <div className="flex flex-col justify-center px-12">
        <h1 className="!text-4xl font-bold leading-tight !py-2 !mb-5">
          {product.title}
        </h1>
        <p className="mt-2 leading-relaxed text-zinc-400 !text-lg !p-y2 !mb-5">
          {product.description}
        </p>

        <div className="mt-8 flex items-center gap-3 !text-md">
          <span className="inline-block rounded-full bg-violet-500 !p-3 font-semibold">
            {typeof product.price === 'number'
              ? product.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 2,
                })
              : 'N/A'}
          </span>
          <span className="text-zinc-400 !text-lg">
            In 12x of{' '}
            {typeof product.price === 'number'
              ? (product.price / 12).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
              : 'N/A'}
          </span>
        </div>

        <AddToCartButton productId={product.id} />
      </div>

      <div className="h-5 w-full" />
      <div>
        <h4 className="flex justify-between gap-2 mb-3 text-2xl">
          <span className="">Ratings</span>
          <span className="text-yellow-400 text-right">{starsAverage}</span>
        </h4>
        <hr />
        {product.ratings &&
          product.ratings.length > 0 &&
          product.ratings.map((rate: Rate) => (
            <div key={rate.id}>
              <div className="flex justify-between gap-2">
                <div>
                  <p>{rate.title}</p>
                  <p className="text-zinc-400">({rate.description})</p>
                </div>
                <span className="text-yellow-400 text-right">{rate.stars}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
/*
★★★★★
*/
