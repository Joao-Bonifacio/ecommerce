import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaServiceMongo } from '../prisma.service'
import type { Product } from '@/prisma/generated/mongo'

@Injectable()
export class ProductStorage {
  constructor(private prisma: PrismaServiceMongo) {}

  async listProduct(): Promise<Product[] | null> {
    const products = await this.prisma.product.findMany()
    return products
  }

  async findProductsByOwner(owner: string): Promise<Product[] | null> {
    const product = await this.prisma.product.findMany({
      where: { owner },
    })
    return product
  }

  async findProductById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })
    return product
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
    })
    return product
  }

  async findFeaturedProducts(): Promise<Product[] | null> {
    const products = await this.prisma.product.findMany({
      where: { featured: true },
    })
    return products
  }

  async searchproducts(query: string): Promise<Product[] | null> {
    if (!query) return null

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    })

    return products
  }

  async uploadProduct(
    owner: string,
    title: string,
    description: string,
    price: number,
    slug: string,
    image: string,
  ): Promise<Product> {
    const slugAlreadyExists = await this.prisma.product.findUnique({
      where: { slug },
    })
    if (slugAlreadyExists) {
      throw new HttpException(
        { message: 'Slug already exists, choose another title' },
        HttpStatus.BAD_REQUEST,
      )
    }

    const product = await this.prisma.product.create({
      data: {
        owner,
        title,
        description,
        price,
        slug,
        image,
        featured: false,
        sales: 0,
        ratings: [],
      },
    })

    return product
  }

  async featureProduct(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { featured: true },
    })
  }

  async removeProduct(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    })
  }
}
