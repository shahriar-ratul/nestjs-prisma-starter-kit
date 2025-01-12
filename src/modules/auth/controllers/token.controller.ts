import { PageDto, PageOptionsDto } from "@/core/dto";
import { CreateTokenDto } from "@/modules/auth/dto/create-token.dto";
import { UpdateTokenDto } from "@/modules/auth/dto/update-token.dto";
import { TokenService } from "@/modules/auth/services/token.service";
import { Controller, Get, Post, Body, Patch, Param, Delete, SetMetadata, Query } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AdminToken } from "@prisma/client";

@Controller("tokens")
export class TokenController {
  constructor(private readonly _tokenService: TokenService) {}

  @Post()
  create(@Body() createAuthDto: CreateTokenDto) {
    return this._tokenService.create(createAuthDto);
  }

  @Get()
  @ApiResponse({})
  @SetMetadata("permissions", ["admin.view"])
  async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<AdminToken>> {
    return await this._tokenService.findAll(pageOptionsDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this._tokenService.findById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuthDto: UpdateTokenDto) {
    return this._tokenService.update(+id, updateAuthDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this._tokenService.remove(+id);
  }
}
