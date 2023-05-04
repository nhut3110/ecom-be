import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Res,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/token-payload.type';
import { Tokens } from './types/token.type';
import { Response } from 'express';
import { AuthConfigService } from 'src/config/auth/auth-config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authConfigService: AuthConfigService,
  ) {}

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

  @Get('facebook')
  async facebookLogin(@Res() res: Response) {
    const redirectUri = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${this.authConfigService.getFacebookClientId()}&redirect_uri=${this.authConfigService.getFacebookCallbackUrl()}`;
    return res.redirect(redirectUri);
  }

  @Get('facebook/callback')
  async facebookCallback(@Query('code') code: string, @Res() res) {
    try {
      const facebookAccessToken = await this.authService.getFacebookAccessToken(
        code,
      );
      const userData = await this.authService.getFacebookUserData(
        facebookAccessToken,
      );

      const userAccessToken = await this.authService.getSocialUserToken(
        userData,
      );

      return res.redirect(
        `${this.authConfigService.getClientHostUrl()}/auth/callback/${userAccessToken}`,
      );
    } catch (err) {
      throw new UnauthorizedException('Wrong credentials');
    }
  }
}
