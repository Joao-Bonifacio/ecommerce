import { getProduct, getFeaturedProducts } from '@/app/api/product'
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return null

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
    </div>
  )
}
