import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';
import { IdDto } from '../users/dto/id.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Post('bulk')
  createBulk(
    @Body() createCategoryDto: CreateCategoryDto[],
  ): Promise<Category[]> {
    return this.categoriesService.createBulk(createCategoryDto);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: IdDto): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: IdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<number> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: IdDto): Promise<number> {
    console.log(id);
    return this.categoriesService.remove(id);
  }
}
