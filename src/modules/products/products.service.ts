import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { IdDto } from '../users/dto/id.dto';
import { FindManyProductDto } from './dto/find-many.dto';
import { PaginateResult } from '../../shared/interfaces/paginate.interface';

interface QueryFilters {
  title?: { [Op.iLike]: string };
  price?: {
    [Op.between]?: [number, number];
    [Op.gte]?: number;
    [Op.lte]?: number;
  };
  year?: number;
  [key: string]: any; // Additional properties if necessary
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  create(product: CreateProductDto): Promise<Product> {
    return this.productModel.create(product);
  }

  bulkCreate(products: CreateProductDto[]): Promise<Product[]> {
    return this.productModel.bulkCreate(products);
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

  async findMany(
    filterOptions: FindManyProductDto,
  ): Promise<PaginateResult<Product>> {
    const {
      sortBy,
      sortDirection,
      title,
      cursor,
      limit,
      minPrice,
      maxPrice,
      year,
      exceptedProducts,
      ...additionalFilters
    } = filterOptions;

    const exclusionFilter = exceptedProducts?.length
      ? { id: { [Op.notIn]: exceptedProducts } }
      : {};

    const filters: QueryFilters = {
      ...additionalFilters,
      ...(title && { title: { [Op.iLike]: `%${title}%` } }),
      ...(year && { year }),
    };

    if (minPrice !== undefined && maxPrice !== undefined) {
      filters.price = { [Op.between]: [minPrice, maxPrice] };
    } else {
      if (minPrice !== undefined)
        filters.price = { ...(filters.price || {}), [Op.gte]: minPrice };
      if (maxPrice !== undefined)
        filters.price = { ...(filters.price || {}), [Op.lte]: maxPrice };
    }

    const { rows, count } = await this.productModel.findAndCountAll({
      where: {
        ...filters,
        ...exclusionFilter,
        ...(cursor && { [sortBy]: { [Op.gt]: cursor } }),
      },
      order: [[sortBy, sortDirection]],
      limit,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        nextCursor: rows.length > 0 ? rows[rows.length - 1][sortBy] : null,
      },
    };
  }

  async count(filterOptions: FindManyProductDto): Promise<number> {
    const {
      sortBy,
      sortDirection,
      title,
      categoryId,
      year,
      minPrice,
      maxPrice,
      ...filters
    } = filterOptions;

    return this.productModel.count({
      where: {
        ...(title && { title: { [Op.iLike]: `%${title}%` } }),
        ...(categoryId && { categoryId }),
        ...(year && { year }),
        ...(minPrice !== undefined &&
          maxPrice !== undefined && {
            price: { [Op.between]: [minPrice, maxPrice] },
          }),
        ...filters,
      },
    });
  }

  async clearRatings(): Promise<void> {
    await this.productModel.update({ rate: 0 }, { where: {} });
  }

  async updatePricesToVND(): Promise<number> {
    const exchangeRate = 25500; // USD to VND exchange rate
    const minUSDPrice = 10000;

    // Fetch products that need conversion
    const productsToUpdate = await this.productModel.findAll({
      where: {
        price: { [Op.lte]: minUSDPrice },
      },
    });

    const updatedProducts = productsToUpdate.map((product) => {
      const roundedUSDPrice = Math.round(product.price);
      const priceInVND = roundedUSDPrice * exchangeRate;
      return { id: product.id, price: priceInVND };
    });

    // Update products with new prices in VND
    const updatePromises = updatedProducts.map((product) =>
      this.productModel.update(
        { price: product.price },
        { where: { id: product.id } },
      ),
    );

    await Promise.all(updatePromises);

    // Return the number of products updated
    return updatedProducts.length;
  }
}
