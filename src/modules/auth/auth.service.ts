import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "@/modules/auth/token/token.service";

import { Request } from "express";

// 1 day in milliseconds
const EXPIRE_TIME = 1000 * 60 * 60 * 24;
@Injectable()
export class AuthService {
  constructor(
    private readonly _prisma: PrismaService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  create(createAuthDto: LoginDto) {
    return "This action adds a new auth";
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: RegisterDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async findAdmin(id: number) {
    return `This action removes a #${id} auth`;
  }

  async findAdminByUsername(username: string) {
    return await this._prisma.admin.findFirst({
      where: {
        username: username,
      },
    });
  }

  async getPermissions(id: number) {
    const admin = await this._prisma.admin.findFirst({
      where: {
        id: id,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!admin) {
      return [];
    }

    const permissions = admin.permissions.map((p) => p.permission);

    const roles = admin.roles.map((r) => r.role.permissions.map((p) => p.permission));

    const rolePermissions = roles.flat();

    const mergePermissions = [...permissions, ...rolePermissions];

    const uniquePermissions = mergePermissions.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

    // keep only slug from permissions
    const slugPermissions = uniquePermissions.map((permission) => permission.slug);

    // sort permissions
    const sortedPermissions = slugPermissions.sort();

    return sortedPermissions;
  }

  async login(credential: LoginDto, request: Request): Promise<any> {
    const user = await this.findAdminByUsername(credential.username);

    if (!user) {
      throw new UnauthorizedException("invalid credentials");
    }

    if (!(await bcrypt.compare(credential.password, user.password))) {
      throw new UnauthorizedException("Password is incorrect");
    }

    if (user.isActive === false) {
      throw new UnauthorizedException("Your Have Been Blocked. Please Contact Admin");
    }

    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: "1d",
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
      secret: process.env.JWT_REFRESH_TOKEN_KEY,
    });

    // 1d  = 1 day = 24 hours

    let ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress;

    // convert ip to string
    ip = ip?.toString();

    try {
      const data = await this.tokenService.create({
        token: token,
        refresh_token: refreshToken,
        admin_id: user.id,
        ip: ip || "",
        userAgent: request.headers["user-agent"] || "",
        expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      });

      console.log(data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Failed to create token");
    }

    return {
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: EXPIRE_TIME,
    };
  }

  async validateUser(credential: LoginDto) {
    const user = await this.findAdminByUsername(credential.username);

    if (!user) {
      throw new BadRequestException("invalid credentials");
    }

    if (!(await bcrypt.compare(credential.password, user.password))) {
      throw new BadRequestException("Password is incorrect");
    }

    if (user.isActive === false) {
      throw new BadRequestException("Your Have Been Blocked. Please Contact Admin");
    }

    return user;
  }

  async verifyJwt(jwt: string) {
    const { exp } = await this.jwtService.verifyAsync(jwt);

    if (exp < Date.now()) {
      throw new Error("Token expired");
    }

    return { exp };
  }

  async getProfile(req: Request): Promise<any> {
    try {
      const id = (req.user as any).id as number;
      const user = await this.findAdmin(id);

      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Invalid Token");
    }
  }
  async verifyToken(req: Request): Promise<any> {
    const id = (req.user as any).id as number;
    const user = await this.findAdmin(id);

    if (!user) {
      throw new Error("invalid credentials");
    }

    return {
      message: "success",
    };
  }

  async logout(req: Request): Promise<any> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException("Authorization header is missing");
    }
    const token = req.headers.authorization.split(" ")[1];

    await this.tokenService.revokeToken(token);

    return {
      message: "Logout Success",
    };
  }
}
