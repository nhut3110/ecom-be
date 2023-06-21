import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavoriteController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorite.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Favorite, Product])],
  controllers: [FavoriteController],
  providers: [FavoritesService],
})
export class FavoriteModule {}
