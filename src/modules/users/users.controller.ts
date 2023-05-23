import {
  Controller,
  Get,
  UploadedFile,
  UseGuards,
  Patch,
  Body,
  Res,
  Req,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { JwtPayload } from '../auth/types/token-payload.type';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOneById(@Req() req: Request): Promise<User> {
    const jwtPayload: JwtPayload = req.user;
    const id = jwtPayload.id.toString();
    if (!id) throw new BadRequestException('user not found');

    const user = await this.usersService.findOneById(id);
    delete user.password;

    return user;
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateById(
    @Body() updateData: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const jwtPayload: JwtPayload = req.user;
    const id = jwtPayload.id.toString();
    if (!id) throw new BadRequestException('User not found');

    const count = this.usersService.updateById(id, updateData);
    if (count)
      return res.status(HttpStatus.OK).json({
        message: 'Updated successfully',
      });

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Unable to update user',
    });
  }

  @Patch('me/avatar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const jwtPayload: JwtPayload = req.user;
    const id = jwtPayload.id.toString();
    if (!id) throw new BadRequestException('User not found');

    const avatar = await this.usersService.uploadImageToCloudinary(file);
    const count = await this.usersService.updateById(id, {
      picture: avatar.url,
    });

    if (count)
      return res.status(HttpStatus.OK).json({
        message: 'Updated avatar successfully',
        picture: avatar.url,
      });

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Unable to update avatar. Please try again',
    });
  }
}
