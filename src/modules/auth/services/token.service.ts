import { BadRequestException, Global, Injectable } from "@nestjs/common";

import { CreateTokenDto } from "../dto/create-token.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "@/core/dto";
import { AdminToken, Prisma } from "@prisma/client";
import { format } from "date-fns";

@Global()
@Injectable()
export class TokenService {
  constructor(private readonly _prisma: PrismaService) {}

  async findAll(query: PageOptionsDto): Promise<PageDto<AdminToken>> {
    const limit: number = query.limit || 10;
    const page: number = query.page || 1;
    const skip: number = (page - 1) * limit;
    const search = query.search || "";

    const sort = query.sort || "id";

    const order = query.order || "asc";

    // const data = await this._prisma.admin.findMany({
    //   include: {
    //     roles: true,
    //   },
    //   where: {
    //     OR: [
    //       { email: { contains: search } },
    //       { username: { contains: search } },
    //       { mobile: { contains: search } },
    //     ],
    //   },
    //   take: limit,
    //   skip: skip,
    //   orderBy: {
    //     [sort]: order.toUpperCase(),
    //   },
    // });

    const queryData: Prisma.AdminTokenFindManyArgs = {
      where: {
        OR: [
          { token: { contains: search } },
          { refreshToken: { contains: search } },
          { ip: { contains: search } },
          { userAgent: { contains: search } },
        ],
      },
      include: {
        admin: true,
      },

      take: limit,
      skip: skip,
      orderBy: {
        [sort]: order.toLowerCase(),
      },
    };
    const [items, count] = await this._prisma.$transaction([
      this._prisma.adminToken.findMany(queryData),
      this._prisma.adminToken.count({ where: queryData.where }),
    ]);

    const pageOptionsDto = {
      limit: limit,
      page: page,
      skip: skip,
    };

    const pageMetaDto = new PageMetaDto({
      total: count,
      pageOptionsDto: pageOptionsDto,
    });
    const adminResponses: AdminToken[] = items.map((item) => ({
      ...item,
    }));

    return new PageDto(adminResponses, pageMetaDto);
  }

  async create(createTokenDto: CreateTokenDto) {
    await this._prisma.adminToken.create({
      data: {
        token: createTokenDto.token || "",
        refreshToken: createTokenDto.refresh_token || "",
        ip: createTokenDto.ip || "",
        userAgent: createTokenDto.userAgent || "",
        expiresAt: createTokenDto.expires_at,
        admin: {
          connect: {
            id: Number(createTokenDto.admin_id),
          },
        },
      },
    });

    const timeNow = format(new Date(), "yyyy-MM-dd HH:mm:ss a");

    return {
      message: `Token Created Successfully by Admin ID: ${createTokenDto.admin_id} ip: ${createTokenDto.ip} at time: ${timeNow}`,
    };
  }

  async findById(id: number) {
    const token = await this._prisma.adminToken.findUnique({
      where: {
        id: id,
      },
    });

    if (!token) {
      throw new BadRequestException("Token not found");
    }

    return token;
  }

  async findByAdminId(adminId: number) {
    const tokens = await this._prisma.adminToken.findMany({
      include: {
        admin: true,
      },
      where: {
        adminId: adminId,
      },
    });

    if (!tokens) {
      throw new BadRequestException("Tokens not found");
    }

    return tokens;
  }

  async findByToken(token: string) {
    const tokenData = await this._prisma.adminToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!tokenData) {
      throw new BadRequestException("Token not found");
    }

    return tokenData;
  }

  // isRevokedToken
  async isRevokedToken(token: string) {
    const tokenData = await this._prisma.adminToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!tokenData) {
      return false;
    }

    if (tokenData.isRevoked) {
      return true;
    }

    return false;
  }

  async update(id: number, updateTokenDto: Prisma.AdminTokenUpdateInput) {
    const tokenData = await this._prisma.adminToken.findUnique({
      where: {
        id: id,
      },
    });

    if (!tokenData) {
      throw new BadRequestException("Token not found");
    }

    return await this._prisma.adminToken.update({
      where: {
        id: id,
      },
      data: updateTokenDto,
    });
  }

  async remove(id: number) {
    const item = await this._prisma.adminToken.findUnique({
      where: {
        id: id,
      },
    });

    if (!item) {
      return {
        message: "Token Not Found",
      };
    }

    return await this._prisma.adminToken.delete({
      where: {
        id: id,
      },
    });
  }

  async revokeToken(token: string) {
    const tokenData = await this._prisma.adminToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!tokenData) {
      return {
        message: "Token Not Found",
      };
    }

    return await this._prisma.adminToken.update({
      where: {
        id: tokenData.id,
      },
      data: {
        isRevoked: true,
      },
    });
  }
}
