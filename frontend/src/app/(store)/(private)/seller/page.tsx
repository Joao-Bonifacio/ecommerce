import { getMyProducts } from '@/api/product'
import type { Product } from '@/api/validation/types/product'
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, Pencil, Plus, Trash } from 'lucide-react'
import Image from 'next/image'

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
    <div className="w-full mx-auto p-5">
      <div className="flex w-full">
        <div className="flex-1/2 p-4 w-full!">
          <h4>List - ({products.length})</h4>
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
                            {product.title} ({product.sales})
                          </h5>
                          <p className="text-xs text-gray-500">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1/2 text-right p-4">
                      <Button className="mx-2">
                        <Pencil />
                      </Button>
                      <Button className="mx-2">
                        <Banknote />
                      </Button>
                      <Button className="mx-2">
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          <div className="p-4 m4">
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 cursor-pointer p-4 rounded-md">
                    <Plus /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                  </AlertDialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" name="description" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" type="number" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="fileName">Image Name</Label>
                      <Input id="fileName" name="fileName" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="file">Upload Image</Label>
                      <Input id="file" name="file" type="file" />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Upload</Button>
                  </AlertDialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>

        <div className="flex-1/2">
          <h4 className="text-2xl! flex justify-between">
            <span className="flex-1/2">Sales - ({totalSales})</span>
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
              products.map((product: Product) => (
                <li key={product.id} className="flex justify-between p-2">
                  <span className="text-sm">{product.title}</span>
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
