import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common'
import { ProductService } from './product.service'
import type { Product, Rating } from '@/prisma/generated/mongo'
import { Public } from '@/infra/auth/public'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('products')
export class ProductController {
  constructor(private product: ProductService) {}

  @Public()
  @Get()
  productList(): Promise<Product[] | null> {
    return this.product.productList()
  }

  @Public()
  @Get('owner/:nickname')
  findProductsByOwner(
    @Param('nickname') nickname: string,
  ): Promise<Product[] | null> {
    return this.product.findProductsByOwner(nickname)
  }

  @Public()
  @Get('slug/:slug')
  async findProductBySlug(@Param('slug') slug: string): Promise<Product> {
    const product = await this.product.findProductBySlug(slug)
    if (!product) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    return product
  }

  @Public()
  @Get('featured')
  findFeaturedProducts(): Promise<Product[] | null> {
    return this.product.findFeaturedProducts()
  }

  @Public()
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
    console.log(user)
    return this.product.ratingProduct(id, user.nickname, body)
  }
}
