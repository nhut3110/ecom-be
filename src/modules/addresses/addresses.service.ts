import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.entity';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
  ) {}

  create(userId: string, addressDto: AddressDto): Promise<Address> {
    return this.addressModel.create({ ...addressDto, userId });
  }

  getListByUserId(userId: string): Promise<Address[]> {
    return this.addressModel.findAll({ where: { userId } });
  }

  get(id: string, userId: string): Promise<Address> {
    return this.addressModel.findOne({ where: { id, userId } });
  }

  async update(id: string, userId: string, addressDto: AddressDto) {
    await this.addressModel.update(addressDto, { where: { id, userId } });
    return this.addressModel.findOne({ where: { id, userId } });
  }

  delete(id: string, userId: string): Promise<number> {
    return this.addressModel.destroy({ where: { id, userId } });
  }
}
