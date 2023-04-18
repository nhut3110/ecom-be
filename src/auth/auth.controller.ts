import { Controller, Body, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { UsersService } from 'src/models/users/users.service';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() loginDetail: AuthDto) {
    const { username, password } = loginDetail;

    return this.authService.login({
      username: username,
      password: password,
    });
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refreshToken')
  requestRefreshToken(@Req() req: Request & { user: JwtPayload }) {
    const { username, refreshToken } = req.user;
    return this.authService.requestRefreshTokens(username, refreshToken);
  }
}
