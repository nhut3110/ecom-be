import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Product } from '../products/product.entity';
import { SortValues } from 'src/constants';
import { FavoriteDto } from './dto/favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @Get('sortAndFilter')
  async getSortedProducts(
    @Query('userId') userId: string,
    @Query('sortType') sortType?: SortValues,
    @Query('filterCategoryId') filterCategoryId?: string,
  ): Promise<Product[]> {
    return await this.favoriteService.getSortedAndFilteredFavoriteList(
      userId,
      sortType,
      filterCategoryId,
    );
  }

  @Get(':userId')
  async getFavoriteProductList(@Param('userId') userId: string) {
    return this.favoriteService.getFavoriteProductListByUserId(userId);
  }

  @Post()
  async addProductToFavorite(@Body() body: FavoriteDto) {
    const { userId, productId } = body;
    return this.favoriteService.addProductToFavorite(userId, productId);
  }

  @Delete(':userId/:productId')
  async removeProductFromFavorite(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.favoriteService.removeProductFromFavorite(userId, productId);
  }
}
