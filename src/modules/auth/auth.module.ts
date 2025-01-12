import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { TokenService } from "@/modules/auth/services/token.service";
import { TokenController } from "@/modules/auth/controllers/token.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "@/modules/auth/strategies/jwt-strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AbilityFactory } from "@/modules/auth/ability/ability.factory";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "3d" },
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, TokenController],
  providers: [AuthService, TokenService, JwtStrategy, AbilityFactory],
  exports: [AuthService, JwtStrategy, AbilityFactory, JwtModule, TokenService],
})
export class AuthModule {}
