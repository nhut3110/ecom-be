import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  create(@Body() user: CreateUserDto) {
    this.usersService.create(user);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':username')
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  delete(@Param('username') username: string) {
    return this.usersService.delete(username);
  }
}
