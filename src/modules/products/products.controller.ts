import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FindManyProductDto } from './dto/find-many.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('all')
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: IdDto): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Get()
  findMany(
    @Query(new ValidationPipe({ whitelist: true })) filters: FindManyProductDto,
  ) {
    return this.productsService.findMany(filters);
  }

  @Post('bulk')
  createBulk(@Body() products: CreateProductDto[]): Promise<Product[]> {
    return this.productsService.bulkCreate(products);
  }
}
