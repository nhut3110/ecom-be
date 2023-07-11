import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductAdditionalImagesDto } from './dto/product-additional-image.dto';
import { ProductAdditionalImage } from './product_additional_image.entity';

@Injectable()
export class ProductAdditionalImagesService {
  constructor(
    @InjectModel(ProductAdditionalImage)
    private readonly productAdditionalImageModel: typeof ProductAdditionalImage,
  ) {}

  create(image: ProductAdditionalImagesDto): Promise<ProductAdditionalImage> {
    return this.productAdditionalImageModel.create(image);
  }

  bulkCreate(
    images: ProductAdditionalImagesDto[],
  ): Promise<ProductAdditionalImage[]> {
    return this.productAdditionalImageModel.bulkCreate(images);
  }

  findAll(): Promise<ProductAdditionalImage[]> {
    return this.productAdditionalImageModel.findAll();
  }

  async findOne(id: string): Promise<ProductAdditionalImage> {
    const image = await this.productAdditionalImageModel.findOne({
      where: { id: id },
    });
    if (!image) throw new Error('Product additional image not found');
    return image;
  }

  findByProductId(productId: string): Promise<ProductAdditionalImage[]> {
    return this.productAdditionalImageModel.findAll({
      where: { productId: productId },
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.productAdditionalImageModel.destroy({
      where: { id: id },
    });
    if (result === 0) throw new Error('No record found to delete');
  }
}
