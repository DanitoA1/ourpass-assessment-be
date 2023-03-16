import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.usersService.getUserByEmail(payload.email);
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const storedToken = await this.tokenService.getToken(token);
    if (!storedToken) throw new UnauthorizedException('Token no longer valid');
    return user;
  }
}
