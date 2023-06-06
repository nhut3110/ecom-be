import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { AppConfigService } from 'src/modules/config/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtSecretKey,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<{ id: string; email: string }> {
    const { id } = payload;
    const user = await this.usersService.findOneById(id);
    if (!user) throw new UnauthorizedException('Invalid token');

    return { id: id, email: user.email };
  }
}
