import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FindManyProductDto } from './dto/find-many.dto';
import { OrderItem } from 'sequelize/types/model';
import { IPaginateResult } from './paginate-product.interface';
import { SortDirection } from 'src/constants';

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

  paginationResult(
    list: Product[],
    limit: number,
    keyQueryCursor: string,
  ): IPaginateResult {
    const hasNextPage = list.length > limit;
    const data = hasNextPage ? list.slice(0, -1) : list;
    const nextCursor = hasNextPage
      ? data[data.length - 1][keyQueryCursor]
      : undefined;

    return { data, pagination: { total: data.length, nextCursor } };
  }

  async findMany(filterOptions: FindManyProductDto): Promise<IPaginateResult> {
    const { sortBy, sortDirection, title, cursor, limit, ...filters } =
      filterOptions;

    const keyQueryCursor: string = sortBy ?? 'id';
    const defaultCursorOrder: OrderItem = ['id', 'ASC'];
    const cursorOperator = sortDirection === SortDirection.ASC ? Op.gt : Op.lt;

    const data = await this.productModel.findAll({
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
        ...filters,
        ...(cursor && { [keyQueryCursor]: { [cursorOperator]: cursor } }),
      },
      order: [sortBy ? [sortBy, sortDirection] : defaultCursorOrder],
      limit: limit + 1,
    });

    return this.paginationResult(data, limit, keyQueryCursor);
  }
}
