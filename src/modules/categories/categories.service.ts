import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';
import { IdDto } from '../users/dto/id.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}

  create(category: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create(category);
  }

  createBulk(categories: CreateCategoryDto[]): Promise<Category[]> {
    return this.categoryModel.bulkCreate(categories);
  }

  findAll(): Promise<Category[]> {
    return this.categoryModel.findAll();
  }

  async findOne(id: IdDto): Promise<Category> {
    const product = await this.categoryModel.findOne({ where: { id: id } });

    if (product) return product.dataValues;

    throw new Error('Unable to find category');
  }

  async update(
    id: IdDto,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoryModel.update(updateCategoryDto, {
      where: { id: id },
    });

    return this.categoryModel.findOne({ where: { id: id } });
  }

  remove(id: IdDto): Promise<number> {
    return this.categoryModel.destroy({ where: { id: id } });
  }
}
