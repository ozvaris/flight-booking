// src/auth/jwt.strategy.ts
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import { UserWithoutPassword } from './user-without-password.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserWithoutPassword | null> {
    // console.log("3 - validate " + payload.email)
    const user = await this.authService.validateUserByJwt(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}