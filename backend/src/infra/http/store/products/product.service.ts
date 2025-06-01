import { ProductStorage } from '@/infra/db/prisma/transactions/product.transaction'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import type { UploadProductBody } from './product.dto'
import { S3Storage } from '@/infra/db/image/s3.service'
import type { Product } from '@/prisma/generated/mongo'
import { UserStorage } from '@/infra/db/prisma/transactions/user.transaction'

@Injectable()
export class ProductService {
  constructor(
    private user: UserStorage,
    private product: ProductStorage,
    private s3: S3Storage,
  ) {}

  generateSlug = (owner: string, title: string): string =>
    `${owner}-${title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '')}`

  async productList(): Promise<Product[] | null> {
    const products = await this.product.listProduct()
    return products
  }

  async findProductsByOwner(owner: string): Promise<Product[] | null> {
    const product = await this.product.findProductsByOwner(owner)
    return product
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    const product = await this.product.findProductById(slug)
    return product
  }

  async findFeaturedProducts(): Promise<Product[] | null> {
    const products = await this.product.findFeaturedProducts()
    return products
  }

  async seachProducts(query: string): Promise<Product[] | null> {
    const products = await this.product.searchproducts(query)
    return products
  }

  async uploadProduct(
    id: string,
    body: UploadProductBody,
    file: Express.Multer.File,
  ): Promise<Product | null> {
    const { title, description, price } = body
    const { originalname: fileName, mimetype: fileType, buffer } = file
    const { url } = await this.s3.upload({ fileName, fileType, body: buffer })
    const user = await this.user.findById(id)
    if (!user) return null
    const owner = user.nickname
    const slug = this.generateSlug(owner, title)

    const product = await this.product.uploadProduct(
      owner,
      title,
      description,
      Number(price),
      slug,
      url,
    )

    return product
  }

  async featureProduct(id: string): Promise<void> {
    await this.product.featureProduct(id)
  }

  async removeProduct(id: string): Promise<void> {
    const product = await this.product.findProductById(id)
    if (!product) {
      throw new HttpException(
        { message: 'Product not found' },
        HttpStatus.BAD_REQUEST,
      )
    }
    const fileName = product.image.split('/')
    await this.s3.delete(fileName[fileName.length - 1])
    await this.product.removeProduct(id)
  }
}
