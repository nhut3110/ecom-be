import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  async create(product: CreateProductDto): Promise<Product> {
    return await this.productModel.create(product);
  }

  async createBulk(products: CreateProductDto[]) {
    return products.map(
      async (product: CreateProductDto) =>
        await this.productModel.create(product),
    );
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ where: { id: id } });

    if (product) return product.dataValues;

    return null;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<number> {
    const [affectedCount] = await this.productModel.update(updateProductDto, {
      where: { id: id },
    });

    return affectedCount;
  }

  async remove(id: string): Promise<number> {
    return this.productModel.destroy({ where: { id: id } });
  }

  async clear() {
    return this.productModel.destroy({ where: {} });
  }
}
