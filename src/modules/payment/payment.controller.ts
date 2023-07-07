import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { PaymentDto } from './dto/payment.dto';
import { UserData } from 'src/decorators/user-data.decorator';
import { Payment } from './payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() paymentDto: PaymentDto,
    @UserData('id') userId: string,
  ): Promise<Payment> {
    return this.paymentService.create(userId, paymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  get(
    @UserData('id') userId: string,
    @Param('id') id: string,
  ): Promise<Payment> {
    return this.paymentService.get(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByUserId(@UserData('id') userId: string): Promise<Payment[]> {
    return this.paymentService.getListByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @UserData('id') userId: string,
  ): Promise<number> {
    return this.paymentService.delete(id, userId);
  }
}
