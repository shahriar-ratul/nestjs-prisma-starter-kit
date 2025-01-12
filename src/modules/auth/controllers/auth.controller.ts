import { Controller, Get, Post, Body, HttpCode, HttpStatus, Req, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { ApiResponse } from "@nestjs/swagger";
import { Public } from "@/core/decorator";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";

import { Request as TypeRequest } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this._authService.register(registerDto);
  }

  // @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiResponse({
    status: 200,
    description: "Login success Response",
    example: {
      statusCode: 200,
      success: true,
      data: {
        accessToken: "string",
        refreshToken: "string",
        expiresIn: "number",
      },
    },
  })
  @Public()
  async login(
    @Body() credential: LoginDto,
    @Req() request: TypeRequest,
    // @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return await this._authService.login(credential, request);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "Get Profile Successful",
  })
  @Get("profile")
  async getProfile(@Req() req: TypeRequest) {
    return await this._authService.getProfile(req);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "Verify Successful",
  })
  @Get("verify")
  async verify(@Req() req: TypeRequest) {
    return await this._authService.verifyToken(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Request() req: TypeRequest) {
    return await this._authService.logout(req);
  }
}