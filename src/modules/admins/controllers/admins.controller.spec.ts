import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admins.controller';
import { AdminsService } from '../services/admins.service';

import { AuthService } from '@/modules/auth/services/auth.service';
import { AbilityFactory } from '@/modules/auth/ability/ability.factory';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/modules/prisma/prisma.service';

describe('AdminsController', () => {
  let controller: AdminsController;

  const mockAdminsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    changeStatus: jest.fn(),
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    findByUsernameOrEmail: jest.fn(),
    getPermissions: jest.fn(),
    getAllAdmins: jest.fn(),
  };

  const mockAbilityFactory = {
    defineAbility: jest.fn()
  };

  const mockAuthService = {
    validateUser: jest.fn()
  };

  const jwtAuthGuard = {
    canActivate: jest.fn()
  };

  const jwtService = {
    sign: jest.fn()
  };

  const mockPrismaService = {
    admin: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    }
  };
  


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AdminsController],
      providers: [
        {
          provide: AdminsService,
          useValue: mockAdminsService,
        },
        {
          provide: AbilityFactory,
          useValue: mockAbilityFactory,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtAuthGuard,
          useValue: jwtAuthGuard,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
         provide: PrismaService,
         useValue: mockPrismaService,
        }
      ],
    }).compile();

    controller = module.get<AdminsController>(AdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create a new admin', async () => {
  //     const mockFile = {
  //       fieldname: 'image',
  //       originalname: 'test.jpg',
  //       encoding: '7bit',
  //       mimetype: 'image/jpeg',
  //       buffer: Buffer.from('test'),
  //       size: 955578,
  //     } as Express.Multer.File;

  //     const createAdminDto = {
  //       email: 'admin@example.com',
  //       password: 'password123',
  //       mobile: '1234567890',
  //       username: 'testadmin',
  //       firstName: 'Test',
  //       lastName: 'Admin',
  //       isActive: true,
  //       dob: new Date('2000-01-01'),
  //       joinedDate: new Date('2024-01-01'),
  //       roles: [1]
  //     };

  //     const expectedResult = { message: 'Admin created successfully' };
      
  //     jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
      
  //     expect(await controller.create(mockFile, createAdminDto)).toBe(expectedResult);
  //     expect(service.create).toHaveBeenCalledWith(createAdminDto, mockFile);
  //   });
  // });

  // describe('findAll', () => {
  //   it('should return array of admins', async () => {
  //     const expectedResult = {
  //       items: [
  //         {
  //           id: 1,
  //           firstName: 'Test',
  //           lastName: 'Admin',
  //           dob: new Date('2000-01-01'),
  //           mobile: '1234567890',
  //           username: 'testadmin',
  //           email: 'admin@example.com',
  //           password: 'password123',
  //           photo: null,
  //           joinedDate: new Date('2024-01-01'),
  //           gender: null,
  //           lastLogin: null,
  //           isVerified: false,
  //           isActive: true,
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //           deletedAt: null,
  //           verifiedAt: null,
  //           verifiedByEmail: false,
  //           verifiedByMobile: false,
  //           deleted: false,
  //           deletedBy: null,
  //           roles: [{
  //             roleId: 1,
  //             role: {
  //               id: 1,
  //               name: 'Admin',
  //               slug: 'admin',
  //               isActive: true
  //             }
  //           }]
  //         }
  //       ],
  //       meta: {
  //         page: 1,
  //         limit: 10,
  //         total: 1,
  //         totalPages: 1
  //       }
  //     } as unknown as PageDto<Admin>;
      
  //     const query: PageOptionsDto = {
  //       page: 1,
  //       limit: 10,
  //       search: '',
  //       sort: 'id',
  //       order: 'desc' as Order,
  //       skip: 0
  //     };

  //     jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);
      
  //     const result = await controller.findAll(query);
  //     expect(result).toEqual(expectedResult);
  //     expect(service.findAll).toHaveBeenCalledWith(query);
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return a single admin', async () => {
  //     const expectedResult = {
  //       data: {
  //         id: 1,
  //         firstName: 'Test',
  //         lastName: 'Admin',
  //         dob: new Date('2000-01-01'),
  //         mobile: '1234567890',
  //         username: 'testadmin',
  //         email: 'admin@example.com',
  //         password: 'password123',
  //         photo: null,
  //         joinedDate: new Date('2024-01-01'),
  //         gender: null,
  //         lastLogin: null,
  //         isVerified: false,
  //         isActive: true,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         deletedAt: null,
  //         verifiedAt: null,
  //         verifiedByEmail: false,
  //         verifiedByMobile: false,
  //         deleted: false,
  //         deletedBy: null,
  //         roles: [{
  //           roleId: 1,
  //           role: {
  //             id: 1,
  //             name: 'Admin',
  //             slug: 'admin',
  //             isActive: true
  //           }
  //         }]
  //       },
  //       permissions: ['admin.create', 'admin.read']
  //     };
      
  //     jest.spyOn(service, 'findById').mockResolvedValue(expectedResult);
      
  //     const result = await controller.findOne(1);
  //     expect(result).toEqual(expectedResult);
  //     expect(service.findById).toHaveBeenCalledWith(1);
  //   });
  // });

  // describe('update', () => {
  //   it('should update an admin', async () => {
  //     const updateAdminDto = {
  //       name: 'Updated Admin',
  //     };
  //     const expectedResult = { message: 'Admin updated successfully' };
      
  //     jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
      
  //     expect(await controller.update(1, updateAdminDto)).toBe(expectedResult);
  //     expect(service.update).toHaveBeenCalledWith(1, updateAdminDto);
  //   });
  // });

  // describe('remove', () => {
  //   it('should remove an admin', async () => {
  //     const expectedResult = { message: 'Admin removed successfully' };
      
  //     jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);
      
  //     expect(await controller.remove(1)).toBe(expectedResult);
  //     expect(service.remove).toHaveBeenCalledWith(1);
  //   });
  // });

  // describe('changeStatus', () => {
  //   it('should change admin status', async () => {
  //     const expectedResult = { message: 'Admin status updated successfully' };
      
  //     jest.spyOn(service, 'changeStatus').mockResolvedValue(expectedResult);
      
  //     expect(await controller.changeStatus(1)).toBe(expectedResult);
  //     expect(service.changeStatus).toHaveBeenCalledWith(1);
  //   });
  // });

});
