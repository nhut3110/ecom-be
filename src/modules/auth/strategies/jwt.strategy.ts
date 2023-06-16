import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { Request } from 'express';
import { TokensService } from 'src/modules/tokens/tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokensService,
    appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtSecretKey,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: any,
  ): Promise<{ id: string; email: string }> {
    const token = request.headers.authorization.split(' ')[1];
    const { id } = payload;
    const isValidToken = await this.tokenService.validateAndRemovePair(
      id,
      token,
      false,
    );

    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    const user = await this.usersService.findOneById(id);
    if (!user) throw new UnauthorizedException('Invalid token');

    return { id: id, email: user.email };
  }
}
