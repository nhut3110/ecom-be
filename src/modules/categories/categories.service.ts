import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}
  async create(category: CreateCategoryDto): Promise<Category> {
    return await this.categoryModel.create(category);
  }

  async createBulk(
    categories: CreateCategoryDto[],
  ): Promise<Promise<Category>[]> {
    return categories.map(
      async (category: CreateCategoryDto) =>
        await this.categoryModel.create(category),
    );
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.findAll();
  }

  async findOne(id: string): Promise<Category> {
    const product = await this.categoryModel.findOne({ where: { id: id } });

    if (product) return product.dataValues;

    return null;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<number> {
    const [affectedCount] = await this.categoryModel.update(updateCategoryDto, {
      where: { id: id },
    });

    return affectedCount;
  }

  async remove(id: string): Promise<number> {
    return this.categoryModel.destroy({ where: { id: id } });
  }
}
