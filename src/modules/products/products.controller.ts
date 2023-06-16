import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { SortValues } from 'src/constants';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('search')
  async getSearchedList(@Query('title') title: string) {
    return await this.productsService.search(title);
  }

  @Get('sortAndFilter')
  async getSortedList(
    @Query('sortType') sortType?: SortValues,
    @Query('filterCategoryId') filterCategoryId?: string,
  ): Promise<Product[]> {
    return await this.productsService.getSortedAndFilteredList(
      sortType,
      filterCategoryId,
    );
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: IdDto): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Post('bulk')
  createBulk(@Body() createProductDto: CreateProductDto[]): Promise<Product[]> {
    return this.productsService.createBulk(createProductDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: IdDto,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: IdDto): Promise<number> {
    return this.productsService.remove(id);
  }
}
