import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductAdditionalImagesDto } from './dto/product-additional-image.dto';
import { ProductAdditionalImagesService } from './product_additional_images.service';

@Controller('product-additional-images')
export class ProductAdditionalImagesController {
  constructor(private readonly imagesService: ProductAdditionalImagesService) {}

  @Post()
  bulkCreate(@Body() images: ProductAdditionalImagesDto[]) {
    return this.imagesService.bulkCreate(images);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @Get('by-product/:productId')
  findByProductId(@Param('productId') productId: string) {
    return this.imagesService.findByProductId(productId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}
