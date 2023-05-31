import {
  Controller,
  Body,
  Req,
  Post,
  Patch,
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
import { User } from '../users/user.entity';
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

  @Patch('password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() passwordData: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<object> {
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
}
