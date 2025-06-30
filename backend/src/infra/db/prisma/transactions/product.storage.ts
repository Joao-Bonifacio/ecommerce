import { Injectable } from '@nestjs/common'
import { PrismaServiceMongo } from '../prisma.service'
import type { Product, Rating } from '@/prisma/generated/mongo'

export type ProductError =
  | { error: true; badNickname: true }
  | { error: true; badSlug: true }
  | { error: true; badQuery: true }
  | { error: true; badProduct: true }
  | { error: true; badUserBody: true }

@Injectable()
export class ProductStorage {
  constructor(private prisma: PrismaServiceMongo) {}

  async listProducts(): Promise<Product[] | null> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return products
  }

  async findProductsByOwner(owner: string): Promise<Product[] | null> {
    const products = await this.prisma.product.findMany({
      where: { owner },
      orderBy: { createdAt: 'desc' },
    })
    return products
  }

  async findProductById(id: string): Promise<Product | ProductError> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })
    if (!product) return { error: true, badProduct: true }
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

  async searchProducts(query: string): Promise<Product[] | null> {
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

  // seller

  async rateProduct(
    id: string,
    nickname: string,
    data: Omit<Rating, 'id'>,
  ): Promise<Rating | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })
    if (!product || product.owner !== nickname) return null

    const { ratings } = await this.prisma.product.update({
      where: { id },
      data: {
        ratings: {
          push: { ...data, id: crypto.randomUUID() },
        },
      },
    })
    return ratings[ratings.length - 1]
  }

  async uploadProduct(
    nickname: string,
    title: string,
    description: string,
    price: number,
    slug: string,
    image: string,
    stock: number,
  ): Promise<Product | ProductError> {
    const slugAlreadyExists = await this.prisma.product.findUnique({
      where: { slug },
    })
    if (slugAlreadyExists) return { error: true, badSlug: true }

    const product = await this.prisma.product.create({
      data: {
        owner: nickname,
        title,
        description,
        price,
        slug,
        image,
        stock,
        featured: false,
        sales: 0,
        ratings: [],
      },
    })

    return product
  }

  async editProduct(
    id: string,
    data: Partial<Product>,
  ): Promise<Product | ProductError> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { owner, createdAt, ratings, sales, ...safeData } = data

    if (safeData.slug) {
      const existing = await this.prisma.product.findFirst({
        where: {
          slug: safeData.slug,
          NOT: { id },
        },
      })

      if (existing) {
        return { error: true, badSlug: true }
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...safeData,
        updatedAt: new Date(),
      },
    })
  }

  async featureProduct(id: string, nickname: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) return null
    if (product.owner !== nickname) return null

    return await this.prisma.product.update({
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
