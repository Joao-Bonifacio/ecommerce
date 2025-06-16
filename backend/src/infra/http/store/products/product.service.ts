import { ProductStorage } from '@/infra/db/prisma/transactions/product.storage'
import { Injectable } from '@nestjs/common'
import type { Product, Rating } from '@/prisma/generated/mongo'
import { CacheStorage } from '@/infra/db/cache/cache.service'

@Injectable()
export class ProductService {
  constructor(
    private product: ProductStorage,
    private cache: CacheStorage,
  ) {}

  async productList(): Promise<Product[] | null> {
    const products = await this.product.listProducts()
    return products
  }

  async findProductsByOwner(owner: string): Promise<Product[] | null> {
    const product = await this.product.findProductsByOwner(owner)
    return product
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    const key = `product:${slug}`
    const cached = await this.cache.get(key)
    if (cached) return JSON.parse(cached)

    const product = await this.product.findProductBySlug(slug)
    if (product) {
      await this.cache.setex(key, 60 * 5, JSON.stringify(product)) // TTL 5 minutes
    }
    return product
  }

  async findFeaturedProducts(): Promise<Product[] | null> {
    const cached = await this.cache.get('featured-products')
    if (cached) return JSON.parse(cached)

    const products = await this.product.findFeaturedProducts()
    if (products) {
      await this.cache.setex(
        'featured-products',
        60 * 5,
        JSON.stringify(products),
      ) // TTL 5 minutes
    }
    return products
  }

  async searchProducts(query: string): Promise<Product[] | null> {
    const products = await this.product.searchProducts(query)
    return products
  }

  async ratingProduct(
    id: string,
    nickname: string,
    data: Omit<Rating, 'id'>,
  ): Promise<Rating | null> {
    return await this.product.rateProduct(id, nickname, data)
  }
}
