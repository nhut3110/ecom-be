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
  async get(
    @UserData('id') userId: string,
    @Param('id') id: string,
  ): Promise<Payment> {
    const Payment = await this.paymentService.get(id);

    if (Payment.userId !== userId)
      throw new UnauthorizedException('Invalid user');

    return Payment;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByUserId(@UserData('id') userId: string): Promise<Payment[]> {
    return this.paymentService.getListByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<number> {
    return this.paymentService.delete(id);
  }
}
