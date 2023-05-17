import {
  Controller,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
  Delete,
  Res,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('all')
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get('findByEmail/:email')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    delete user.password;

    return user;
  }

  @Get('me/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOneById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    delete user.password;

    return user;
  }

  @Patch('me/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateById(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
    @Res() res: Response,
  ) {
    const count = this.usersService.updateById(id, updateData);
    if (count)
      return res.status(HttpStatus.OK).json({
        message: 'Updated successfully',
      });

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Unable to update user',
    });
  }

  @Delete('me/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.usersService.deleteById(id);
  }
}
