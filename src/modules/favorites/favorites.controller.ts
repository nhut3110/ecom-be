import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService as FavoriteService } from './favorites.service';
import { FavoriteDto, FindManyFavoriteDto } from './dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('my-favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findMany(
    @UserData('id') userId: string,
    @Query(new ValidationPipe({ whitelist: true }))
    filters: FindManyFavoriteDto,
  ) {
    return this.favoriteService.findProductList(userId, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@UserData('id') userId: string, @Body() body: FavoriteDto) {
    const { productId } = body;
    return this.favoriteService.add(userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async remove(@UserData('id') userId: string, @Param() productId: string) {
    return this.favoriteService.remove(userId, productId);
  }
}
