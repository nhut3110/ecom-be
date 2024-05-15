import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FindManyProductDto } from './dto/find-many.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { OnlyDevGuard } from 'src/middleware/guards/only-dev.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('all')
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get('count')
  count(
    @Query(new ValidationPipe({ whitelist: true }))
    filters: FindManyProductDto,
  ): Promise<number> {
    return this.productsService.count(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: IdDto): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Get()
  findMany(
    @Query(new ValidationPipe({ whitelist: true }))
    filters: FindManyProductDto,
  ) {
    return this.productsService.findMany(filters);
  }

  // @UseGuards(OnlyDevGuard)
  @Post('clear-ratings')
  clearRatings(): Promise<void> {
    return this.productsService.clearRatings();
  }

  @Post('bulk')
  createBulk(@Body() products: CreateProductDto[]): Promise<Product[]> {
    return this.productsService.bulkCreate(products);
  }

  @Put('update-to-vnd')
  async updatePricesToVND(): Promise<{ updatedCount: number }> {
    const updatedCount = await this.productsService.updatePricesToVND();
    return { updatedCount };
  }
}
