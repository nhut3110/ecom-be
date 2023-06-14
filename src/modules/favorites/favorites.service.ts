import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favorite } from './favorite.entity';
import { Product } from '../products/product.entity';
import { SortValues } from 'src/constants';
import { sortFunctions } from '../products/products.constant';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite)
    private readonly favoriteModel: typeof Favorite,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async getFavoriteProductListByUserId(userId: string): Promise<Product[]> {
    const favorites = await this.favoriteModel.findAll({
      where: { userId },
    });

    const productIds = favorites.map((favorite) => favorite.productId);

    return this.productModel.findAll({
      where: { id: productIds },
    });
  }

  async addProductToFavorite(
    userId: string,
    productId: string,
  ): Promise<Favorite> {
    const product = await this.favoriteModel.findOne({
      where: { userId, productId },
    });
    if (product)
      throw new BadRequestException('Product already exists in favorites');

    return await this.favoriteModel.create({ userId, productId });
  }

  async removeProductFromFavorite(
    userId: string,
    productId: string,
  ): Promise<void> {
    await this.favoriteModel.destroy({ where: { userId, productId } });
  }

  async getSortedAndFilteredFavoriteList(
    userId: string,
    sortOption?: SortValues,
    categoryId?: string,
  ): Promise<Product[]> {
    let filteredAndSortedProducts = await this.getFavoriteProductListByUserId(
      userId,
    );

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
}
