import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService as FavoriteService } from './favorites.service';
import { FavoriteDto, FindManyFavoriteDto } from './dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';
import { Favorite } from './favorite.entity';
import { PaginateResult } from 'src/shared';
import { Product } from '../products/product.entity';

@Controller('my-favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findMany(
    @UserData('id') userId: string,
    @Query(new ValidationPipe({ whitelist: true }))
    filters: FindManyFavoriteDto,
  ): Promise<PaginateResult<Product>> {
    return this.favoriteService.findProductList(userId, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  add(
    @UserData('id') userId: string,
    @Body() body: FavoriteDto,
  ): Promise<Favorite> {
    const { productId } = body;
    return this.favoriteService.add(userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  remove(
    @UserData('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<number> {
    return this.favoriteService.remove(userId, productId);
  }
}
