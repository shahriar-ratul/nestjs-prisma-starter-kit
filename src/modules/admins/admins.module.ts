import { Module } from "@nestjs/common";
import { AdminsService } from "./services/admins.service";
import { AdminsController } from "./controllers/admins.controller";
import { AuthModule } from "@/modules/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
