import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDTO, LoginDTO } from './signUp.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('signUp')
  async signUP(@Body() signUp: CreateUserDTO) {
    return await this.appService.signUp(signUp);
  }

  @Post('login')
  async login(@Body() login: LoginDTO) {
    return await this.appService.login(login);
  }
}
