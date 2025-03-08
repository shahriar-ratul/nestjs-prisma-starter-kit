// import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  // async validate(payload: any) {
  //   const { sub } = payload;

  //   const entries = Object.entries(payload);
  //   Logger.log(entries + 'payload');

  //   console.log(sub + 'payload');

  //   return { userId: sub };
  // }

  async validate(payload: any) {
    const { sub, email, username } = payload;

    // console.log(sub, email, username);

    return {
      id: sub,
      email: email,
      username: username,
    };
  }
}
