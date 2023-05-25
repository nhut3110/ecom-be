import {
  Controller,
  Get,
  UploadedFile,
  UseGuards,
  Patch,
  Body,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOneById(@UserData('id') userId: string): Promise<User> {
    if (!userId) throw new BadRequestException('user not found');

    const user = await this.usersService.findOneById(userId);
    delete user.password;

    return user;
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateById(
    @Body() updateData: UpdateUserDto,
    @UserData('id') userId: string,
  ) {
    if (!userId) throw new BadRequestException('user not found');

    await this.userModel.update(updateData, {
      where: { id: userId },
    });
  }

  @Patch('me/avatar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @UserData('id') userId: string,
  ) {
    if (!userId) throw new BadRequestException('user not found');

    const avatar = await this.usersService.uploadImageToCloudinary(file);
    await this.userModel.update(
      { picture: avatar.url },
      { where: { id: userId } },
    );

    return { picture: avatar.url };
  }
}
