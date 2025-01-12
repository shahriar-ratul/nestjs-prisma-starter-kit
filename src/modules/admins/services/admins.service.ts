import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Admin, Prisma } from "@prisma/client";
import { hash } from "bcrypt";
import { CreateAdminDto } from "../dto/create-admin.dto";
import { UpdateAdminDto } from "../dto/update-admin.dto";
import { PageDto, PageMetaDto, PageOptionsDto } from "./../../../core/dto";
import { PrismaService } from "./../../prisma/prisma.service";

@Injectable()
export class AdminsService {
  constructor(private readonly _prisma: PrismaService) {}

  // get all admins
  async findAll(query: PageOptionsDto): Promise<PageDto<Admin>> {
    const limit: number = query.limit || 10;
    const page: number = query.page || 1;
    const skip: number = (page - 1) * limit;
    const search = query.search || "";

    const sort = query.sort || "id";
    const order = query.order || "asc";
    const queryData: Prisma.AdminFindManyArgs = {
      where: {
        OR: [{ email: { contains: search } }, { username: { contains: search } }, { mobile: { contains: search } }],
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      omit: {
        password: true,
      },

      take: limit,
      skip: skip,
      orderBy: {
        [sort]: order.toLowerCase(),
      },
    };
    const [items, count] = await this._prisma.$transaction([
      this._prisma.admin.findMany(queryData),
      this._prisma.admin.count({ where: queryData.where }),
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
    // const adminResponses: AdminEntity[] = items.map((admin) => ({
    //   ...admin,
    //   mobile: admin.mobile, // Assuming 'mobile' is equivalent to 'mobile'
    // }));

    return new PageDto(items, pageMetaDto);
  }

  // add admin
  async create(createAdminDto: CreateAdminDto, file: Express.Multer.File) {
    const checkAdmin = await this._prisma.admin.findFirst({
      where: {
        OR: [{ email: createAdminDto.email }, { username: createAdminDto.username }, { mobile: createAdminDto.mobile }],
      },
    });

    if (checkAdmin) {
      throw new HttpException("Admin already exists ", HttpStatus.BAD_REQUEST);
    }

    const createPassword = await hash(createAdminDto.password, 15);

    const admin = await this._prisma.admin.create({
      data: {
        firstName: createAdminDto.firstName,
        lastName: createAdminDto.lastName,
        email: createAdminDto.email,
        username: createAdminDto.username,
        mobile: createAdminDto.mobile,
        password: createPassword,
        isActive: createAdminDto.isActive,
        photo: file ? file.path : null,
        joinedDate: createAdminDto.joinedDate || new Date(),
        dob: createAdminDto.dob || null,
      },
    });

    for (const role of createAdminDto.roles) {
      await this._prisma.adminRole.create({
        data: {
          adminId: admin.id,
          roleId: Number(role),
        },
      });
    }

    return {
      message: "Admin Created Successfully",
    };
  }

  // get admin by id
  async findById(id: number) {
    const admin = await this._prisma.admin.findUnique({
      where: {
        id: id,
      },
      omit: {
        password: true,
      },
      include: {
        roles: {
          select: {
            roleId: true,
            role: {
              select: {
                id: true,
                isActive: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!admin) {
      throw new HttpException("Admin Not Found ", HttpStatus.BAD_REQUEST);
    }

    const roles = await this._prisma.role.findMany({
      where: {
        id: {
          in: admin.roles.map((role) => role.roleId),
        },
      },
      include: {
        permissions: {
          select: {
            permissionId: true,
            permission: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    const permissions = roles.map((role) => role.permissions.map((permission) => permission.permission));

    const adminPermissions = permissions.flat();

    // unique permissions
    const uniquePermissions = adminPermissions.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

    // keep only slug from permissions
    const slugPermissions = uniquePermissions.map((permission) => permission.slug);

    // sort permissions
    const sortedPermissions = slugPermissions.sort();

    return {
      data: admin,
      permissions: sortedPermissions,
    };
  }

  async update(id: number, updateAdminDto: UpdateAdminDto, file: Express.Multer.File) {
    const data = await this._prisma.admin.findFirst({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new HttpException("Admin Not Found ", HttpStatus.BAD_REQUEST);
    }

    // check if email or username or mobile exists
    const checkAdmin = await this._prisma.admin.findFirst({
      where: {
        NOT: {
          id: id,
        },
        OR: [{ email: updateAdminDto.email }, { username: updateAdminDto.username }, { mobile: updateAdminDto.mobile }],
      },
    });

    if (checkAdmin) {
      throw new HttpException("Admin already exists ", HttpStatus.BAD_REQUEST);
    }

    await this._prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        email: updateAdminDto.email ? updateAdminDto.email : data.email,
        username: updateAdminDto.username ? updateAdminDto.username : data.username,
        mobile: updateAdminDto.mobile ? updateAdminDto.mobile : data.mobile,
        isActive: updateAdminDto.isActive ? updateAdminDto.isActive : data.isActive,
        photo: file ? file.path : data.photo,
        joinedDate: updateAdminDto.joinedDate ? updateAdminDto.joinedDate : data.joinedDate,
        dob: updateAdminDto.dob ? updateAdminDto.dob : data.dob,
        firstName: updateAdminDto.firstName ? updateAdminDto.firstName : data.firstName,
        lastName: updateAdminDto.lastName ? updateAdminDto.lastName : data.lastName,
      },
    });

    if (updateAdminDto.password) {
      const updatePassword = await hash(updateAdminDto.password, 15);

      await this._prisma.admin.update({
        where: {
          id: id,
        },
        data: {
          password: updatePassword,
        },
      });
    }

    if (updateAdminDto.roles && updateAdminDto.roles.length > 0) {
      await this._prisma.adminRole.deleteMany({
        where: {
          adminId: id,
        },
      });

      for (const role of updateAdminDto.roles) {
        await this._prisma.adminRole.create({
          data: {
            adminId: id,
            roleId: role,
          },
        });
      }
    }

    return {
      message: "Admin Updated Successfully",
    };
  }

  async remove(id: number) {
    const admin = await this._prisma.admin.findFirst({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!admin) {
      throw new HttpException("Admin not found", HttpStatus.BAD_REQUEST);
    }

    if (admin.roles.length > 0) {
      // superadmin role cannot be deleted
      if (admin.roles.find((role) => role.role.slug === "superadmin")) {
        throw new HttpException("SuperAdmin role cannot be deleted", HttpStatus.BAD_REQUEST);
      }
    }

    // delete admin

    await this._prisma.admin.delete({
      where: {
        id: id,
      },
    });

    return {
      message: "Admin deleted successfully",
    };
  }

  async changeStatus(id: number) {
    const admin = await this._prisma.admin.findFirst({
      where: { id },
    });

    if (!admin) {
      throw new HttpException("Admin not found", HttpStatus.BAD_REQUEST);
    }

    if (admin.username === "super_admin") {
      throw new HttpException("SuperAdmin status cannot be changed", HttpStatus.BAD_REQUEST);
    }

    await this._prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        isActive: !admin.isActive,
      },
    });

    return {
      message: "Status Changed successfully",
    };
  }

  async findByUsername(username: string) {
    return await this._prisma.admin.findFirst({ where: { username } });
  }

  async findByEmail(email: string) {
    return await this._prisma.admin.findFirst({ where: { email } });
  }

  async findOne(id: number) {
    return await this._prisma.admin.findFirst({ where: { id } });
  }

  async findByUsernameOrEmail(username: string) {
    // check if username or email exists
    return await this._prisma.admin.findFirst({
      where: {
        OR: [{ email: username }, { username: username }, { mobile: username }],
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async getPermissions(id: number) {
    const admin = await this._prisma.admin.findFirst({
      where: { id },
      include: {
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
      throw new HttpException("Admin not found", HttpStatus.BAD_REQUEST);
    }

    const roles = await this._prisma.role.findMany({
      where: {
        id: {
          in: admin.roles.map((role) => role.roleId),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const permissions = roles.map((role) => role.permissions.map((permission) => permission.permission));

    const adminPermissions = permissions.flat();

    // unique permissions
    const uniquePermissions = adminPermissions.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

    // keep only slug from permissions
    const slugPermissions = uniquePermissions.map((permission) => permission.slug);

    // sort permissions
    const sortedPermissions = slugPermissions.sort();

    return {
      message: "Permissions fetched successfully",
      permissions: sortedPermissions,
    };
  }

  // getAllAdmins
  async getAllAdmins() {
    const items = await this._prisma.admin.findMany({
      where: {
        isActive: true,
      },
      omit: {
        password: true,
        deleted: true,
        deletedAt: true,
        deletedBy: true,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return {
      message: "Items fetched successfully",
      items: items,
    };
  }
}
