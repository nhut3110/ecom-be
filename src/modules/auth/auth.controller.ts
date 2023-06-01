import {
  Controller,
  Body,
  Req,
  Get,
  Post,
  Patch,
  Param,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/token-payload.type';
import { Tokens } from './types/token.type';
import { FacebookLoginBodyDto } from './dto/facebook-body.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { TokensService } from '../tokens/tokens.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Get('otp/:email')
  async sendOTPEmail(@Param('email') email: string) {
    console.log(email);
    return await this.authService.sendOTP(email);
  }

  @Post('verifyOtp')
  async verifyOTP(@Body() email: string, code: string): Promise<boolean> {
    const isVerified = await this.authService.verifyOTP(email, code);

    if (!isVerified) return false;

    return true;
  }

  @Post('register')
  async register(@Body() user: CreateUserDto, code: string): Promise<User> {
    const isVerified = await this.authService.verifyOTP(user.email, code);

    if (!isVerified) throw new BadRequestException('Invalid OTP code');

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

  @Patch('password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() passwordData: ChangePasswordDto,
    @Req() req: Request,
  ) {
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
