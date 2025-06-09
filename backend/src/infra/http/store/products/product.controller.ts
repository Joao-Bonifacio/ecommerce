import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import type { Product, Rating } from '@/prisma/generated/mongo'
import { Public } from '@/infra/auth/public'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Public()
@Controller('products')
export class ProductController {
  constructor(private product: ProductService) {}

  @Get()
  productList(): Promise<Product[] | []> {
    return this.product.productList()
  }

  @Get('owner/:nickname')
  findProductsByOwner(
    @Param('nickname') nickname: string,
  ): Promise<Product[] | null> {
    return this.product.findProductsByOwner(nickname)
  }

  @Get('slug/:slug')
  findProductBySlug(@Param('slug') slug: string): Promise<Product | null> {
    return this.product.findProductBySlug(slug)
  }

  @Get('featured')
  findFeaturedProducts(): Promise<Product[] | null> {
    return this.product.findFeaturedProducts()
  }

  @Get('search')
  async seachProducts(@Query('q') query: string): Promise<Product[] | null> {
    const products = await this.product.searchProducts(query)
    return products
  }

  @Patch('rate/:id')
  async ratingProduct(
    @CurrentUser() user: { sub: string; nickname: string },
    @Param('id') id: string,
    @Body() body: Omit<Rating, 'id'>,
  ) {
    return this.product.ratingProduct(id, user.nickname, body)
  }
}
