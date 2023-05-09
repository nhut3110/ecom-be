import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './types/token-payload.type';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './types/token.type';
import axios from 'axios';
import { SocialLoginPayload } from './types/social-payload.type';
import { AppConfigService } from 'src/modules/config/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async validateUser({
    email,
    password,
  }: LoginDto): Promise<JwtPayload | undefined> {
    const user = await this.usersService.findOneWithPassword(email);

    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) return { email: user.email };
  }

  async login({ email, password }: LoginDto): Promise<Tokens> {
    const user: JwtPayload = await this.validateUser({ email, password });

    if (!user) throw new UnauthorizedException();

    const accessToken = await this.getToken({
      email: user.email,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = await this.getToken({
      email: user.email,
      duration: this.appConfigService.jwtRefreshExpiresIn,
    });

    await this.updateRefreshToken(email, refreshToken);

    return { accessToken, refreshToken };
  }

  private updateRefreshToken(email: string, refreshToken: string): void {
    this.usersService.update(email, {
      refreshToken: refreshToken,
    });
  }

  async requestRefreshTokens(
    email: string,
    requestedRefreshToken: string,
  ): Promise<Tokens> {
    const user = await this.usersService.findOne(email);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    if (user.refreshToken != requestedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const accessToken = await this.getToken({
      email: user.email,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = await this.getToken({
      email: user.email,
      duration: this.appConfigService.jwtRefreshExpiresIn,
    });

    await this.updateRefreshToken(user.email, refreshToken);

    return { accessToken, refreshToken };
  }

  async getToken({ email, duration }: JwtPayload): Promise<string> {
    const token = await this.jwtService.sign(
      {
        email,
      },
      {
        expiresIn: duration,
      },
    );

    return token;
  }

  async getFacebookAccessToken(
    code: string,
    callbackUrl: string,
  ): Promise<string> {
    const params = {
      client_id: this.appConfigService.facebookClientId,
      client_secret: this.appConfigService.facebookClientSecret,
      redirect_uri: callbackUrl,
      code,
    };
    const { data } = await axios.get(
      `${this.appConfigService.facebookGraphUrl}/v16.0/oauth/access_token`,
      { params },
    );

    return data.access_token;
  }

  async getFacebookUserData(accessToken: string): Promise<any> {
    const response = await axios.get(
      `${this.appConfigService.facebookGraphUrl}/me`,
      {
        params: {
          fields: 'id,name,email,picture',
          access_token: accessToken,
        },
      },
    );
    const data: SocialLoginPayload = response.data;

    return data;
  }

  async getSocialUserToken(data: SocialLoginPayload) {
    const user = await this.usersService.findOne(data.email);
    if (!user) {
      await this.usersService.create({
        email: data.email,
        password: '',
        name: data.name,
        picture: data.picture.data.url,
      });
    }

    const accessToken = await this.getToken({
      email: data.email,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = await this.getToken({
      email: data.email,
      duration: this.appConfigService.jwtRefreshExpiresIn,
    });

    return {
      refreshToken,
      accessToken,
    };
  }
}
