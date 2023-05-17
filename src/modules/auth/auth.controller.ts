import { Controller, Body, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/token-payload.type';
import { Tokens } from './types/token.type';
import { FacebookLoginBodyDto } from './dto/facebook-body.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<User> {
    const createdUser = await this.authService.register(user);
    delete createdUser.password;

    return createdUser;
  }

  @Post('login')
  async login(@Body() loginDetail: LoginDto): Promise<Tokens> {
    const { email, password } = loginDetail;

    return await this.authService.login({
      email: email,
      password: password,
    });
  }

  @Post('refresh-token')
  requestRefreshToken(@Body() req: Request & JwtPayload): Promise<Tokens> {
    const { refreshToken } = req;
    return this.authService.requestRefreshTokens(refreshToken);
  }

  @Post('facebook')
  async facebookCallback(@Body() body: FacebookLoginBodyDto) {
    try {
      const facebookAccessToken = await this.authService.getFacebookAccessToken(
        body.code,
        body.callbackUrl,
      );

      const userData = await this.authService.getFacebookUserData(
        facebookAccessToken,
      );

      const userTokens = await this.authService.getSocialUserToken(userData);

      return userTokens;
    } catch (err) {
      throw new UnauthorizedException('Wrong credentials');
    }
  }
}
