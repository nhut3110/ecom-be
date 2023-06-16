import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { SortValues } from 'src/constants';
import { sortFunctions } from './products.constant';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  create(product: CreateProductDto): Promise<Product> {
    return this.productModel.create(product);
  }

  createBulk(products: CreateProductDto[]): Promise<Product[]> {
    return this.productModel.bulkCreate(products);
  }

  findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async findOne(id: IdDto): Promise<Product> {
    const product = await this.productModel.findOne({ where: { id: id } });

    if (product) return product.dataValues;

    throw new Error('Product not found');
  }

  async update(
    id: IdDto,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productModel.update(updateProductDto, {
      where: { id: id },
    });

    return this.productModel.findOne({
      where: { id: id },
    });
  }

  remove(id: IdDto): Promise<number> {
    return this.productModel.destroy({ where: { id: id } });
  }

  async getSortedAndFilteredList(
    sortOption?: SortValues,
    categoryId?: string,
  ): Promise<Product[]> {
    let filteredAndSortedProducts = await this.productModel.findAll();

    if (categoryId) {
      filteredAndSortedProducts = filteredAndSortedProducts.filter(
        (product) => product.categoryId === categoryId,
      );
    }

    const sortFunction = sortFunctions[sortOption];
    return sortFunction
      ? filteredAndSortedProducts.sort(sortFunction)
      : filteredAndSortedProducts;
  }

  async search(title: string): Promise<Product[]> {
    const products = await this.productModel.findAll();
    return products.filter((product) =>
      product.title.toLowerCase().includes(title.toLowerCase()),
    );
  }
}
