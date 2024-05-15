import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, where } from 'sequelize';
import { Discount } from './discount.entity';
import { UserDiscount } from './user_discount.entity';
import { DiscountDto } from './dto/discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount)
    private readonly discountModel: typeof Discount,
    @InjectModel(UserDiscount)
    private readonly userDiscountModel: typeof UserDiscount,
  ) {}

  create(dto: DiscountDto): Promise<Discount> {
    return this.discountModel.create(dto);
  }

  createBulk(dto: DiscountDto[]): Promise<Discount[]> {
    return this.discountModel.bulkCreate(dto);
  }

  findAll(params: {
    userId?: string;
    sort?: string;
    sortDirection?: string;
    filter?: any;
    search?: string;
  }): Promise<Discount[]> {
    const {
      userId,
      sort = 'startDate',
      sortDirection = 'ASC',
      filter = {},
      search,
    } = params;

    const whereConditions = {
      ...(filter.discountType && { discountType: filter.discountType }),
      ...(filter.active !== undefined && { active: filter.active }),
      ...(filter.isValid && {
        endDate: {
          [Op.or]: {
            [Op.eq]: null,
            [Op.gte]: new Date(),
          },
        },
      }),
      ...(search && {
        code: {
          [Op.iLike]: `%${search}%`,
        },
      }),
      ...(userId && {
        '$userDiscounts.id$': {
          [Op.eq]: null, // Filter discounts that are not linked to this user
        },
      }),
    };

    const includeConditions = userId
      ? [
          {
            model: UserDiscount,
            attributes: [],
            where: { userId },
            required: false, // Left join to only check existence
          },
        ]
      : [];

    return this.discountModel.findAll({
      where: whereConditions,
      include: includeConditions,
      order: [[sort, sortDirection]],
    });
  }

  findOne(id: string): Promise<Discount> {
    return this.discountModel.findByPk(id);
  }

  update(id: string, dto: UpdateDiscountDto): Promise<[number, Discount[]]> {
    return this.discountModel.update(dto, {
      where: { id },
      returning: true,
    });
  }

  async backOneUsageCount(userDiscountId: string): Promise<UserDiscount> {
    const record = await this.userDiscountModel.findByPk(userDiscountId);
    if (!record) {
      throw new Error('User discount not found.');
    }
    record.usageCount += 1;
    await record.save();
    return record;
  }

  remove(id: string): Promise<number> {
    return this.discountModel.destroy({ where: { id } });
  }

  async claimDiscount(
    userId: string,
    discountId: string,
    usageCount: number,
  ): Promise<UserDiscount> {
    const discount = await this.discountModel.findByPk(discountId);
    if (
      !discount ||
      !discount.active ||
      (discount.endDate && discount.endDate < new Date())
    ) {
      throw new Error('Discount is either inactive or expired.');
    }

    const existingRecord = await this.userDiscountModel.findOne({
      where: { userId, discountId },
    });
    if (existingRecord) {
      throw new Error('Discount already claimed by this user.');
    }

    return this.userDiscountModel.create({ userId, discountId, usageCount });
  }

  async removeDiscountFromUser(
    userId: string,
    discountId: string,
  ): Promise<void> {
    const result = await this.userDiscountModel.destroy({
      where: { userId, discountId },
    });
    if (result === 0) {
      throw new Error('No such discount claim found.');
    }
  }

  async useDiscount(userDiscountId: string): Promise<UserDiscount> {
    const record = await this.userDiscountModel.findByPk(userDiscountId, {
      include: [{ model: Discount }],
    });

    if (!record) {
      throw new Error('Discount not found.');
    }

    const { discount } = record;

    // Check if the discount is still active and not expired
    if (
      !discount.active ||
      (discount.endDate && discount.endDate < new Date())
    ) {
      throw new Error('Discount is either inactive or expired.');
    }

    if (record.usageCount === 0) {
      throw new Error('No uses left for this discount.');
    }

    record.usageCount -= 1;
    await record.save();
    return record;
  }

  async getAllDiscountsOfUser(
    userId: string,
    sort: string,
    sortDirection: string,
    filter: any,
    search?: string,
  ): Promise<UserDiscount[]> {
    return await this.userDiscountModel.findAll({
      include: [
        {
          model: Discount,
          required: true,
          where: {
            ...(filter.discountType && { discountType: filter.discountType }),
            ...(filter.active !== undefined && { active: filter.active }),
            ...(filter.isValid && {
              endDate: {
                [Op.or]: {
                  [Op.eq]: null,
                  [Op.gte]: new Date(),
                },
              },
            }),
            ...(search && { code: { [Op.iLike]: `%${search}%` } }),
          },
        },
      ],
      where: {
        userId,
        ...(filter.isValid && {
          usageCount: {
            [Op.gt]: 0,
          },
        }),
      },
      order: [
        [
          { model: Discount, as: 'discount' },
          sort || 'startDate',
          sortDirection || 'ASC',
        ],
      ],
    });
  }

  async applyDiscount(
    discountId: string,
    totalAmount: number,
  ): Promise<number> {
    const record = await this.userDiscountModel.findByPk(discountId, {
      include: [{ model: Discount }],
    });
    const { discount } = record;
    if (!discount) {
      throw new BadRequestException('Discount not found');
    }

    // Check for minimum purchase requirement
    if (
      discount.minPurchaseAmount &&
      totalAmount < discount.minPurchaseAmount
    ) {
      throw new BadRequestException('Minimum purchase requirement not met');
    }

    // Calculate the discount amount
    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = (discount.discountValue / 100) * totalAmount;
    } else {
      discountAmount = discount.discountValue;
    }

    // Apply maximum discount limit if specified
    if (
      discount.maxDiscountAmount &&
      discountAmount > discount.maxDiscountAmount
    ) {
      discountAmount = discount.maxDiscountAmount;
    }

    // Return the final amount after applying the discount
    return totalAmount - discountAmount;
  }
}
