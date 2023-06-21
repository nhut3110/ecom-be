import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { Product } from './product.entity';
import { Favorite } from '../favorites/favorite.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product, Favorite])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
