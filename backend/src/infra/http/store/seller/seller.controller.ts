import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { SellerService } from './seller.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UploadProductBody } from '../products/product.dto'
import type { Product } from '@/prisma/generated/mongo'

@Controller('seller')
export class SellerController {
  constructor(private seller: SellerService) {}

  @Get('my-products')
  findProductsByOwner(
    @CurrentUser() user: { sub: string; nickname: string },
  ): Promise<Product[] | null> {
    return this.seller.findMyProducts(user.nickname)
  }

  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProduct(
    @CurrentUser() user: { sub: string; nickname: string },
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
  ): Promise<Product> {
    const product = await this.seller.uploadProduct(user.nickname, body, file)
    if (
      product &&
      typeof product === 'object' &&
      'error' in product &&
      product.error
    ) {
      throw new HttpException(product, HttpStatus.BAD_REQUEST)
    }
    return product as Product
  }

  @Patch('edit/:id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async editProduct(
    @CurrentUser() user: { sub: string; nickname: string },
    @Param('id') id: string,
    @Body() body: Partial<Product>,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 }), // 20MB
          new FileTypeValidator({ fileType: /^(image\/png|image\/jpeg)$/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ratings, sales, ...safeBody } = body
    const owner = user.nickname
    const result = await this.seller.editProduct(id, owner, safeBody, file)

    if ('error' in result) {
      throw new HttpException(result, HttpStatus.FORBIDDEN)
    }

    return result
  }

  @Patch('feature/:id')
  @HttpCode(204)
  async featureProduct(
    @CurrentUser() user: { sub: string; nickname: string },
    @Param('id') id: string,
  ): Promise<Product | null> {
    const product = this.seller.featureProduct(id, user.nickname)

    return product
  }

  @Delete('remove/:id')
  @HttpCode(204)
  async removeProduct(@Param('id') id: string): Promise<void> {
    return this.seller.removeProduct(id)
  }
}
