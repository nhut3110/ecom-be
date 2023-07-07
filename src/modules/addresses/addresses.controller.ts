import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserData } from 'src/decorators/user-data.decorator';
import { AddressesService as AddressService } from './addresses.service';
import { AddressDto } from './dto/address.dto';
import { Address } from './address.entity';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() addressDto: AddressDto,
    @UserData('id') userId: string,
  ): Promise<Address> {
    return this.addressService.create(userId, addressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(
    @UserData('id') userId: string,
    @Param('id') id: string,
  ): Promise<Address> {
    const address = await this.addressService.get(id, userId);

    return address;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByUserId(@UserData('id') userId: string): Promise<Address[]> {
    return this.addressService.getListByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() addressDto: AddressDto,
    @UserData('id') userId: string,
  ): Promise<Address> {
    return this.addressService.update(id, userId, addressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @UserData('id') userId: string,
  ): Promise<number> {
    return this.addressService.delete(id, userId);
  }
}
