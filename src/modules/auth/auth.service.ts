import * as bcrypt from 'bcrypt';
import axios from 'axios';
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
import { SocialLoginPayload } from './types/social-payload.type';
import { AppConfigService } from 'src/modules/config/app-config.service';
import jwtDecode from 'jwt-decode';
import { User } from '../users/entities/user.entity';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.appConfigService.salt);
    return await bcrypt.hash(password, salt);
  }

  async validateUser({ email, password }: LoginDto): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return false;

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) return true;

    return false;
  }

  async login({ email, password }: LoginDto): Promise<Tokens> {
    const user: boolean = await this.validateUser({ email, password });

    if (!user) throw new UnauthorizedException();

    const userData: User = await this.usersService.findOneByEmail(email);

    const accessToken = await this.signJWTToken({
      id: userData.id,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = await this.signJWTToken({
      id: userData.id,
      duration: this.appConfigService.jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async register(user: UserDto): Promise<any> {
    const userData = await this.usersService.findOneByEmail(user.email);
    if (!!userData) throw new ForbiddenException('User has already existed');

    return await this.usersService.createUser({
      ...user,
      password: await this.hashPassword(user.password),
    });
  }

  async requestRefreshTokens(requestedRefreshToken: string): Promise<Tokens> {
    const decodedData: any = jwtDecode(requestedRefreshToken);

    const accessToken = await this.signJWTToken({
      id: decodedData.id,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = await this.signJWTToken({
      id: decodedData.id,
      duration: this.appConfigService.jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async signJWTToken({ id, duration }: JwtPayload): Promise<string> {
    const token = this.jwtService.sign(
      {
        id,
      },
      {
        expiresIn: duration,
      },
    );

    return token;
  }

  async getTokens(id: string): Promise<Tokens> {
    const accessToken = await this.signJWTToken({
      id: id,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = await this.signJWTToken({
      id: id,
      duration: this.appConfigService.jwtRefreshExpiresIn,
    });

    return {
      refreshToken,
      accessToken,
    };
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
    const user = await this.usersService.findOneByEmail(data.email);

    if (!user) {
      const createdUserResponse = await this.usersService.createUser({
        email: data.email,
        password: '',
        name: data.name,
        picture: data.picture.data.url,
        provider: 'facebook',
      });

      return this.getTokens(createdUserResponse.id);
    }

    return this.getTokens(user.id);
  }
}
