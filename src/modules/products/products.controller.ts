import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FindManyProductDto } from './dto/find-many.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}
  @Get(':id')
  findOne(@Param('id') id: IdDto): Promise<Product> {
    console.log(id);
    return this.productsService.findOne(id);
  }

  @Get()
  findMany(
    @Query(new ValidationPipe({ whitelist: true })) filters: FindManyProductDto,
  ) {
    return this.productsService.findMany(filters);
  }
}
