import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FindManyProductDto } from './dto/find-many.dto';
import { PaginateResult } from '../../shared/interfaces/paginate.interface';
import { SortDirection } from 'src/shared';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  create(product: CreateProductDto): Promise<Product> {
    return this.productModel.create(product);
  }

  bulkCreate(products: CreateProductDto[]): Promise<Product[]> {
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

  async findMany(
    filterOptions: FindManyProductDto,
  ): Promise<PaginateResult<Product>> {
    const { sortBy, sortDirection, title, cursor, limit, ...filters } =
      filterOptions;

    const cursorOperator = sortDirection === SortDirection.ASC ? Op.gt : Op.lt;

    const { rows, count } = await this.productModel.findAndCountAll({
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
        ...filters,
        ...(cursor && { [sortBy]: { [cursorOperator]: cursor } }),
      },
      order: [[sortBy, sortDirection]],
      limit: limit,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        nextCursor: rows[rows.length - 1]?.[sortBy],
      },
    };
  }
}
