import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/token-payload.type';
import { Tokens } from './types/token.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDetail: LoginDto): Promise<Tokens> {
    const { email, password } = loginDetail;

    return this.authService.login({
      email: email,
      password: password,
    });
  }

  @Post('refresh-token')
  requestRefreshToken(@Body() req: Request & JwtPayload): Promise<Tokens> {
    const { email, refreshToken } = req;
    return this.authService.requestRefreshTokens(email, refreshToken);
  }
}
