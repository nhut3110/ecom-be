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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { SortValues } from 'src/constants';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async getSearchedProducts(@Query('title') title: string) {
    return await this.productsService.searchProducts(title);
  }

  @Get('sortAndFilter')
  async getSortedProducts(
    @Query('sortType') sortType?: SortValues,
    @Query('filterCategoryId') filterCategoryId?: string,
  ): Promise<Product[]> {
    return await this.productsService.getSortedAndFilteredProductList(
      sortType,
      filterCategoryId,
    );
  }

  @Get('pagination')
  async getPaginatedData(
    @Query('cursor') cursor: string,
    @Query('limit') limit: number,
  ): Promise<any> {
    const data = await this.productsService.getPaginationData(
      cursor,
      limit + 1,
    );
    const hasNextPage = data.length > limit;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    const trimmedData = hasNextPage ? data.slice(0, limit) : data;

    return {
      data: trimmedData,
      previousCursor: cursor || null,
      nextCursor,
    };
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
