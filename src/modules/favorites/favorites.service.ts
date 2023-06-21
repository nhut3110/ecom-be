import { Op } from 'sequelize';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favorite } from './favorite.entity';
import { Product } from '../products/product.entity';
import { FindManyFavoriteDto } from './dto/find-many.dto';
import { PaginateResult, SortDirection } from 'src/shared';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite)
    private readonly favoriteModel: typeof Favorite,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async add(userId: string, productId: string): Promise<Favorite> {
    const product = await this.favoriteModel.findOne({
      where: { userId, productId },
    });

    if (product)
      throw new BadRequestException('Product already exists in favorites');

    return await this.favoriteModel.create({ userId, productId });
  }

  remove(userId: string, productId: string): Promise<number> {
    return this.favoriteModel.destroy({ where: { userId, productId } });
  }

  async findProductList(
    userId: string,
    filterOptions: FindManyFavoriteDto,
  ): Promise<PaginateResult<Product>> {
    const { sortBy, sortDirection, title, cursor, limit, ...filters } =
      filterOptions;

    const cursorOperator = sortDirection === SortDirection.ASC ? Op.gt : Op.lt;

    const { rows, count } = await this.productModel.findAndCountAll({
      include: [
        {
          model: Favorite,
          where: { userId },
          required: true,
          attributes: [],
        },
      ],
      where: {
        title: { [Op.iLike]: `%${title}%` },
        ...filters,
        ...(cursor && { [sortBy]: { [cursorOperator]: cursor } }),
      },
      limit: limit,
      order: [[sortBy, sortDirection]],
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
