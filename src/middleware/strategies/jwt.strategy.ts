import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../auth/types/token-payload.type';
import { UsersService } from 'src/models/users/users.service';
import { AuthConfigService } from 'src/config/auth/auth-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private authConfigService: AuthConfigService,
  ) {
    super({
      secretOrKey: authConfigService.getJWTSecretKey(),
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
