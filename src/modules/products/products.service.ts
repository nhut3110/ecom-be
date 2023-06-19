import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FilterDto } from './dto/filter.dto';
import { OrderItem } from 'sequelize/types/model';
import { IPaginateResult } from './paginate-product.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  create(product: CreateProductDto): Promise<Product> {
    return this.productModel.create(product);
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

  async findMany(filterOptions: FilterDto): Promise<IPaginateResult> {
    const {
      sortBy,
      sortDirection,
      searchTitle = '',
      cursor,
      limit,
      ...filters
    } = filterOptions;

    const keyQueryCursor: string = sortBy ?? 'id';
    const defaultCursorOrder: OrderItem = ['id', 'ASC'];

    const data = await this.productModel.findAll({
      where: {
        title: {
          [Op.iLike]: `%${searchTitle}%`,
        },
        ...filters,
        ...(cursor && { [keyQueryCursor]: { [Op.gt]: cursor } }),
      },
      order: [sortBy ? [sortBy, sortDirection] : defaultCursorOrder],
      limit: limit + 1,
    });

    const hasNextPage = data.length > limit;
    const edges = hasNextPage ? data.slice(0, -1) : data;
    const nextCursor = edges[edges.length - 1][keyQueryCursor];

    return { pageData: edges, pageInfo: { hasNextPage, nextCursor } };
  }
}
