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
import { FavoritesService } from './favorites.service';
import { FavoriteDto, FindManyFavoriteDto } from './dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findMany(
    @UserData('id') userId: string,
    @Query(new ValidationPipe({ whitelist: true }))
    filters: FindManyFavoriteDto,
  ) {
    return this.favoriteService.findMany(userId, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async get(@UserData('id') userId: string) {
    return this.favoriteService.getByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@UserData('id') userId: string, @Body() body: FavoriteDto) {
    const { productId } = body;
    return this.favoriteService.add(userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@UserData('id') userId: string, @Body() body: FavoriteDto) {
    const { productId } = body;
    return this.favoriteService.remove(userId, productId);
  }
}
