import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "../services/auth.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../services/token.service";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;


  const mockPrismaService = {
    admin: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockTokenService = {
    createToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

      controller = module.get<AuthController>(AuthController);
      authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should register a new admin", async () => {
    const admin = {
      firstName: "Test",
      lastName: "Admin",
      username: "testadmin",
      email: "testadmin@gmail.com",
      mobile: "1234567890",
      gender: "male",
      dob: new Date("2000-01-01"),
      password: "password",
    };
      
    const expectedResult = {
      message: "Registered successfully",
      data: {
        id: 1,
        firstName: "Test",
        lastName: "Admin",
        username: "testadmin",
        email: "testadmin@gmail.com",
        mobile: "1234567890",
        gender: "male",
        dob: new Date("2000-01-01"),
        password: "password",
        joinedDate: new Date(),
        isActive: true,
        photo: null,
        lastLogin: null,
        isVerified: false,
        verifiedAt: null,
        verifiedByEmail: false,
        verifiedByMobile: false,
        deleted: false,
        deletedBy: null,
        deletedAt: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    };
    jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);
    const result = await controller.register(admin);
    expect(authService.register).toHaveBeenCalledWith(admin);
    expect(result).toEqual(expectedResult);
    });
    it("should throw an error if email already exists", async () => {
      const admin = {
       firstName: "Test",
        lastName: "Admin",
        username: "testadmin",
        email: "testadmin@gmail.com",
        mobile: "1234567890",
        gender: "male",
        dob: new Date("2000-01-01"),
        password: "password",
      };
      jest.spyOn(authService, 'register').mockRejectedValue(new HttpException("Email already exists", HttpStatus.BAD_REQUEST));
      await expect(controller.register(admin)).rejects.toThrow(HttpException);
    });

    it("should throw an error if username already exists", async () => {
      const admin = {
        firstName: "Test",
        lastName: "Admin",
        username: "testadmin",
        email: "testadmin2@gmail.com",
        mobile: "1234567890",
        gender: "male",
        dob: new Date("2000-01-01"),
        password: "password",
      };
      jest.spyOn(authService, 'register').mockRejectedValue(new HttpException("Username already exists", HttpStatus.BAD_REQUEST));
      await expect(controller.register(admin)).rejects.toThrow(HttpException);
    });
  });
 
  describe("login", () => {
    it("should login a user", async () => {
      const admin = {
        username: "testadmin@gmail.com",
        password: "password",
      };
      const expectedResult = {
        message: "Logged in successfully",
        data: {
          accessToken: "string",
          refreshToken: "string",
          expiresIn: "number",
        },
      };
      const mockRequest = {
        userAgent: 'test-agent'
      } as unknown as Request;

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);
      const result = await controller.login(admin, mockRequest);
      expect(result).toEqual(expectedResult);
    });

    it("should throw an error if username or password is incorrect", async () => {
      const admin = {
        username: "testadmin@gmail.com",
        password: "wrongpassword",
      };
      const mockRequest = {
        userAgent: 'test-agent'
      } as unknown as Request;
      jest.spyOn(authService, 'login').mockRejectedValue(new HttpException("Invalid username or password", HttpStatus.BAD_REQUEST));
      await expect(controller.login(admin, mockRequest)).rejects.toThrow(HttpException);
    });
  });
});
