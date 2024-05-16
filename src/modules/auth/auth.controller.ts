import {
  Controller,
  Body,
  Req,
  Post,
  Patch,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  Headers,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/token-payload.type';
import { Tokens } from './types/token.type';
import { FacebookLoginBodyDto } from './dto/facebook-body.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { TokensService } from '../tokens/tokens.service';
import { UserData } from 'src/decorators/user-data.decorator';
import { Response } from 'src/shared';
import { AuthGuard } from '@nestjs/passport';
import { AppConfigService } from '../config/app-config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<User> {
    const createdUser = await this.authService.register(user);
    delete createdUser.password;

    return createdUser;
  }

  @Post('login')
  login(@Body() loginDetail: LoginDto): Promise<Tokens> {
    const { email, password } = loginDetail;

    return this.authService.login({
      email: email,
      password: password,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Headers('Authorization') token: string,
    @UserData('id') userId: string,
  ): Promise<boolean> {
    const accessToken = token.split(' ')[1];

    return this.tokensService.validateAndRemovePair(userId, accessToken, true);
  }

  @Patch('password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Body() passwordData: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<Response> {
    const jwtPayload: JwtPayload = req['user'];
    const id = jwtPayload.id.toString();
    if (!id) throw new BadRequestException('User not found');

    const { oldPassword, newPassword } = passwordData;
    return this.authService.changePassword(id, oldPassword, newPassword);
  }

  @Post('refresh-token')
  requestRefreshToken(@Body() req: Request & JwtPayload): Promise<Tokens> {
    const { refreshToken } = req;
    return this.tokensService.requestRefreshTokens(refreshToken);
  }

  @Post('facebook')
  async facebookCallback(@Body() body: FacebookLoginBodyDto): Promise<Tokens> {
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This guard will handle the redirect to Google
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // Handle callback from Google, this is usually automatically handled by the Google strategy
    const { tokens } = req.user;
    // Redirect user back to the front-end with the tokens (you might use query params or hash fragments depending on your front-end handling)
    return res.redirect(
      `${this.appConfigService.client}/google?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }
}
