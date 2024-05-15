import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DiscountService } from './discounts.service';
import {
  CreateDiscountDto,
  CreateUserDiscountDto,
} from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // @UseGuards(JwtAuthGuard) uncomment later
  @Post('bulk')
  createBulk(@Body() createInstructionDto: CreateDiscountDto[]) {
    return this.discountService.createBulk(createInstructionDto);
  }

  // @UseGuards(JwtAuthGuard) uncomment later
  @Post()
  create(@Body() createInstructionDto: CreateDiscountDto) {
    return this.discountService.create(createInstructionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  getAllDiscountsOfUser(
    @UserData('id') userId: string,
    @Query('sort') sort: string,
    @Query('sortDirection') sortDirection: string,
    @Query() filter: any,
    @Query('search') search: string,
  ) {
    return this.discountService.getAllDiscountsOfUser(
      userId,
      sort,
      sortDirection,
      filter,
      search,
    );
  }

  @Get()
  findAll(
    @Query('sortBy') sort: string,
    @Query('sortDirection') sortDirection: string,
    @Query() filter: any,
    @Query('search') search: string,
    @Query('userId') userId: string,
  ) {
    const params = { userId, sort, sortDirection, filter, search };
    return this.discountService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstructionDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, updateInstructionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':discountId/claim')
  claimDiscount(
    @UserData('id') userId: string,
    @Param('discountId') discountId: string,
    @Body() body: CreateUserDiscountDto,
  ) {
    const { usageCount } = body;
    return this.discountService.claimDiscount(userId, discountId, usageCount);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':discountId/remove')
  removeDiscountFromUser(
    @UserData('id') userId: string,
    @Param('discountId') discountId: string,
  ) {
    return this.discountService.removeDiscountFromUser(userId, discountId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/use/:userDiscountId')
  useDiscount(@Param('userDiscountId') userDiscountId: string) {
    return this.discountService.useDiscount(userDiscountId);
  }
}
