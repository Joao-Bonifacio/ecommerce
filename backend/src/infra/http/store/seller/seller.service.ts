import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Product } from '@/prisma/generated/mongo'
import { S3Storage } from '@/infra/db/image/s3.service'
import {
  type ProductError,
  ProductStorage,
} from '@/infra/db/prisma/transactions/product.storage'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'

@Injectable()
export class SellerService {
  constructor(
    private product: ProductStorage,
    private s3: S3Storage,
    private userStorage: UserStorage,
  ) {}

  generateSlug = (owner: string, title: string): string =>
    `${owner}-${title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '')}`

  async uploadProduct(
    owner: string,
    body: Partial<Product>,
    file: Express.Multer.File,
  ): Promise<Product | ProductError | null> {
    if (!body || !file) return { error: true, badUserBody: true }

    const user = await this.userStorage.findById(owner)
    if (!user) return null

    const { title, description, price } = body
    const { originalname: fileName, mimetype: fileType, buffer } = file
    const { url: image } = await this.s3.upload({
      fileName,
      fileType,
      body: buffer,
    })
    const slug = this.generateSlug(owner, title!)

    const product = await this.product.uploadProduct(
      owner,
      title!,
      description!,
      Number(price),
      slug,
      image,
    )

    return product
  }

  async editProduct(
    id: string,
    owner: string,
    body?: Partial<Product>,
    file?: Express.Multer.File,
  ): Promise<Product | ProductError> {
    const oldProduct = await this.product.findProductById(id)
    if (!oldProduct || 'error' in oldProduct)
      return { error: true, badProduct: true }
    if (oldProduct.owner !== owner) return { error: true, badNickname: true }

    const updateData: Partial<Product> = { ...body }

    if (file) {
      const { url: image } = await this.s3.upload({
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      })
      updateData.image = image
    }

    if (body?.title) {
      updateData.slug = this.generateSlug(owner, body.title)
    }

    return this.product.editProduct(id, updateData)
  }

  async featureProduct(id: string, nickname: string): Promise<Product | null> {
    return await this.product.featureProduct(id, nickname)
  }

  async removeProduct(id: string): Promise<void> {
    const product = await this.product.findProductById(id)
    if (!product || 'error' in product) {
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
