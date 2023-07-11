import { Module } from '@nestjs/common';
import { ProductAdditionalImagesService } from './product_additional_images.service';
import { ProductAdditionalImagesController } from './product_additional_images.controller';
import { Product } from '../products/product.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductAdditionalImage } from './product_additional_image.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductAdditionalImage])],
  controllers: [ProductAdditionalImagesController],
  providers: [ProductAdditionalImagesService],
})
export class ProductAdditionalImagesModule {}
