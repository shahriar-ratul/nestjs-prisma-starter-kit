import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/core/decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }
}
