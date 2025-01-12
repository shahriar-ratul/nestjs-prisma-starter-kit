import { Test, TestingModule } from '@nestjs/testing';
import { AdminsService } from './admins.service';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { PageOptionsDto } from '@/core/dto';
import { Order } from '@/core/constants';

describe('AdminsService', () => {
  let service: AdminsService;

  const prismaServiceMock = {
    admin: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
    },
    $transaction: jest.fn().mockResolvedValue([[], 0]),
  };

  const pageOptionsDtoMock: PageOptionsDto = {
    limit: 10,
    page: 1,
    search: "",
    sort: "id",
    order: Order.ASC,
    skip: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<AdminsService>(AdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should return admins", async () => {
    expect(await service.findAll(pageOptionsDtoMock)).toBeDefined();
  });
});
