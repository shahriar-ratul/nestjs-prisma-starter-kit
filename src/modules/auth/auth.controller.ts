import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { ApiResponse } from "@nestjs/swagger";
import { Public } from "@/core/decorator";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";

import { Request as TypeRequest } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: LoginDto) {
    return this._authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this._authService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this._authService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuthDto: RegisterDto) {
    return this._authService.update(+id, updateAuthDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this._authService.remove(+id);
  }

  // @SkipThrottle()
  // @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiResponse({
    status: 200,
    description: "Login Successful",
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
