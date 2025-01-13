import { Test, TestingModule } from "@nestjs/testing";
import { TokenController } from "./token.controller";
import { TokenService } from "../services/token.service";
import { PrismaService } from "@/modules/prisma/prisma.service";

describe("TokenController", () => {
  let controller: TokenController;

  const mockPrismaService = {
    token: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        TokenService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
