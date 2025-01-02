import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "@/core/decorator";

import "dotenv/config";

import { Request } from "express";
import { TokenService } from "@/modules/auth/token/token.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { AuthService } from "@/modules/auth/auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const token = request.headers.authorization?.split(" ")[1] || "";

    if (!token) {
      throw new UnauthorizedException();
    }

    // check token is valid or not

    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }

    try {
      if (token) {
        // check token is exist in database or not
        const isRevoked = await this.tokenService.isRevokedToken(token);

        if (isRevoked) {
          throw new UnauthorizedException();
        }
      }
    } catch (e) {
      console.log("jwt error", e);
      throw new UnauthorizedException();
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
