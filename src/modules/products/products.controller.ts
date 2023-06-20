import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './products.service';

import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FindManyProductDto } from './dto/find-many.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  findMany(@Query() filters: FindManyProductDto) {
    return this.productsService.findMany(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: IdDto): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
