import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UserData('id') userId: string, @Body() createDiscussionDto: any) {
    return this.discussionsService.create({ ...createDiscussionDto, userId });
  }

  @Get()
  findAll(@Query('productId') productId?: string) {
    return this.discussionsService.findAll(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @UserData('id') userId: string,
    @Param('id') id: string,
    @Body() updateDiscussionDto: any,
  ) {
    return this.discussionsService.update(id, userId, updateDiscussionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@UserData('id') userId: string, @Param('id') id: string) {
    return this.discussionsService.remove(id, userId);
  }
}
