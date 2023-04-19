import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  NotAcceptableException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/models/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginRequest } from './interfaces/login.interface';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { Role } from 'src/common/constants/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    username,
    password,
  }: LoginRequest): Promise<JwtPayload | null> {
    const user = await this.usersService.findOne(username);

    if (user) {
      const validatePassword = await bcrypt.compareSync(
        password,
        user.password,
      );

      if (validatePassword)
        return {
          userFullName: user.name,
          username: user.username,
          roles: user.roles,
        };
    }

    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const isUsernameExisting = await this.usersService.findOne(rest.username);
    if (isUsernameExisting)
      throw new NotAcceptableException('username have already existed');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const tokens = await this.getTokens({
      username: rest.username,
      userFullName: rest.name,
      roles: rest.roles,
    });

    this.usersService.create({
      ...rest,
      password: hashedPassword,
      refreshToken: tokens.refreshToken,
      roles: [Role.USER], //by default for now, only create normal user type
    });

    return tokens;
  }

  async login({ username, password }: LoginRequest) {
    const user: JwtPayload = await this.validateUser({ username, password });
    if (user) {
      const tokens = await this.getTokens({
        username: user.username,
        userFullName: user.userFullName,
        roles: user.roles,
      });

      await this.updateRefreshToken(username, tokens.refreshToken);

      return tokens;
    }

    throw new UnauthorizedException();
  }

  async logout(username: string) {
    console.log(username); //do it later
  }

  async updateRefreshToken(username: string, refreshToken: string) {
    await this.usersService.update(username, {
      refreshToken: refreshToken,
    });
  }

  async requestRefreshTokens(username: string, refreshToken: string) {
    const user = await this.usersService.findOne(username);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    if (user.refreshToken !== refreshToken)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({
      userFullName: user.name,
      username: user.username,
      roles: user.roles,
    });
    await this.updateRefreshToken(user.username, tokens.refreshToken);

    return tokens;
  }

  async getTokens({ username, userFullName, roles }: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          username,
          userFullName,
          roles,
        },
        {
          secret: process.env.SECRET_JWT_ACCESS_KEY,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          username,
          userFullName,
          roles,
        },
        {
          secret: process.env.SECRET_JWT_REFRESH_KEY,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
