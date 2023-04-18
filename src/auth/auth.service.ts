import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/models/users/users.service';
import { JwtPayload } from './types/token-payload.type';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password,
  }: LoginDto): Promise<JwtPayload | undefined> {
    const user = await this.usersService.findOne(email);

    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) return { email: user.email };
  }

  async login({ email, password }: LoginDto): Promise<Tokens> {
    const user: JwtPayload = await this.validateUser({ email, password });

    if (!user) throw new UnauthorizedException();

    const accessToken = await this.getToken({
      email: user.email,
      duration: process.env.DURATION_JWT_ACCESS,
    });

    const refreshToken = await this.getToken({
      email: user.email,
      duration: process.env.DURATION_JWT_REFRESH,
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
      duration: process.env.DURATION_JWT_ACCESS,
    });

    const refreshToken = await this.getToken({
      email: user.email,
      duration: process.env.DURATION_JWT_REFRESH,
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
}
