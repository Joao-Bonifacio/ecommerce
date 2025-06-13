'use client'
import { editProduct, featureProduct, removeProduct } from '@/api/product'
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

export function AddProduct() {
  return (
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
              <DialogTitle>Add Product</DialogTitle>
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
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" />
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
  )
}

export function MannageProducts({ id }: { id: string }) {
  return (
    <div className="flex flex-1/2 text-right p-4">
      <Dialog>
        <form
          action={async (data: FormData) => {
            await editProduct(id, data)
          }}
        >
          <DialogTrigger asChild>
            <Button className="mx-2">
              <Pencil />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <DialogTitle>Edit product</DialogTitle>
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
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" />
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
      <Button
        className="mx-2"
        onClick={async () => {
          await featureProduct(id)
        }}
      >
        <Banknote />
      </Button>
      <Button
        className="mx-2"
        onClick={async () => {
          await removeProduct(id)
        }}
      >
        <Trash />
      </Button>
    </div>
  )
}
