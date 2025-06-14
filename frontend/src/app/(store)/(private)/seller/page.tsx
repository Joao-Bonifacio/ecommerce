import { getMyProducts } from '@/api/product'
import type { Product } from '@/api/validation/types/product'
import Image from 'next/image'
import { AddProduct, MannageProducts } from './mannage-products'

const getSales = (
  products: Product[],
): { totalSales: number; totalEarnings: number } => {
  const totalSales = products.reduce(
    (total, product) => total + product.sales,
    0,
  )
  const totalEarnings = products.reduce(
    (total, product) => total + product.price * product.sales,
    0,
  )

  return {
    totalSales,
    totalEarnings,
  }
}

export default async function SellerPannel() {
  const products = await getMyProducts()
  const { totalSales, totalEarnings } = getSales(products)

  return (
    <div className="w-full mx-auto p-5 h-[84vh]">
      <div className="flex w-full">
        <div className="flex-1/2 p-4 w-full">
          <h4 className="text-2xl mb-4">List - ({products.length})</h4>
          <ul className="list-none p-2">
            {products &&
              products.length > 0 &&
              products.map((product: Product) => (
                <li key={product.id}>
                  <div className="flex">
                    <div className="flex-1/2">
                      <div className="flex gap-3">
                        <Image
                          className="rounded-md"
                          src={product.image}
                          width={30}
                          height={30}
                          alt="product-image"
                        />
                        <div className="ml-2">
                          <h5 className="text-sm font-semibold">
                            {product.title} - ({product.stock})
                          </h5>
                          <p className="text-xs text-gray-500">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <MannageProducts id={product.id} />
                  </div>
                </li>
              ))}
          </ul>

          <AddProduct />
        </div>

        <div className="flex-1/2 p-5">
          <h4 className="text-2xl! flex justify-between">
            <span className="flex-1/2 mb-4">Sales - ({totalSales})</span>
            <span className="flex-1/2 text-right">
              {totalEarnings.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
              })}
            </span>
          </h4>

          <ul className="">
            {products &&
              products.length > 0 &&
              products
                .slice()
                .sort((a, b) => b.sales - a.sales)
                .map((product: Product) => (
                  <li key={product.id} className="flex justify-between p-2">
                    <span className="text-sm">
                      {product.title} - ({product.sales})
                    </span>
                    <span className="text-sm">
                      {(product.price * product.sales).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
