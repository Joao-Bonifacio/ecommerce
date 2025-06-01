import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ProductService } from './product.service'
import type { UploadProductBody } from './product.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { Product } from '@/prisma/generated/mongo'
import { Public } from '@/infra/auth/public'

@Controller('products')
export class ProductController {
  constructor(private product: ProductService) {}

  @Public()
  @Get()
  productList(): Promise<Product[] | null> {
    return this.product.productList()
  }

  @Get('owner/:nickname')
  findProductsByOwner(
    @Param('nickname') nickname: string,
  ): Promise<Product[] | null> {
    return this.product.findProductsByOwner(nickname)
  }

  @Public()
  @Get('slug/:slug')
  findProductBySlug(@Param('slug') slug: string): Promise<Product | null> {
    return this.product.findProductBySlug(slug)
  }

  @Public()
  @Get('featured')
  findFeaturedProducts(): Promise<Product[] | null> {
    return this.product.findFeaturedProducts()
  }

  @Public()
  @Get('search')
  seachProducts(@Query('q') query: string): Promise<Product[] | null> {
    if (!query) {
      throw new HttpException('Missing query', HttpStatus.BAD_REQUEST)
    }
    return this.product.seachProducts(query)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadProduct(
    @CurrentUser() user: { sub: string },
    @Body() body: UploadProductBody,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 * 10 }), // 20mb
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Product | null> {
    return this.product.uploadProduct(user.sub, body, file)
  }

  @Patch('featured/:id')
  featureProduct(@Param('id') id: string): Promise<void> {
    return this.product.featureProduct(id)
  }

  @Delete()
  removeProduct(@Param('id') id: string): Promise<void> {
    return this.product.removeProduct(id)
  }
}
