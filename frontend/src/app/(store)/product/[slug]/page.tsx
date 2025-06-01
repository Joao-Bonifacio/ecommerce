import { getProduct, getFeaturedProducts } from '@/app/api/products'
import AddToCartButton from '@/components/add-to-cart-button'
import { Metadata } from 'next'
import Image from 'next/image'

interface ProductProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {} satisfies Metadata
  return {
    title: product.title,
  } satisfies Metadata
}

export async function generateStaticParams(): Promise<
  { slug: string }[] | null
> {
  const products = await getFeaturedProducts()
  if (!products) return null

  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductProps) {
  const product = await getProduct(params.slug)
  if (!product) return null

  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image
          src={product.image}
          alt={product.description}
          width={1000}
          height={1000}
          quality={100}
        />
      </div>

      <div className="flex flex-col justify-center px-12">
        <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>
        <p className="mt-2 leading-relaxed text-zinc-400">
          {product.description}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
            {typeof product.price === 'number'
              ? product.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : 'N/A'}
          </span>
          <span className="text-sm text-zinc-400">
            In 12x of
            {typeof product.price === 'number'
              ? (product.price / 12).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
              : 'N/A'}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <span className="block font-semibold">Sizes</span>
          <div className="felx gap-2">
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              ...
            </button>
          </div>
        </div>

        <AddToCartButton productId={product.id} />
      </div>
    </div>
  )
}
