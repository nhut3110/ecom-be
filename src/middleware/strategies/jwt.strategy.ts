import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/modules/auth/types/token-payload.type';
import { UsersService } from 'src/modules/users/users.service';
import { AppConfigService } from 'src/modules/config/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtSecretKey,
      ignoreExpiration: false,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: JwtPayload) {
    const user = this.usersService.findOne(payload.email);

    if (!user) throw new UnauthorizedException();

    return {
      email: payload.email,
    };
  }
}
