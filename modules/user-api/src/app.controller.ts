import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { COGNITO_AUTH } from './application/auth/cognito.strategy';

@Controller('api')
@UseGuards(AuthGuard(COGNITO_AUTH))
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Request() request: any,
    @Param() params: any,
    @Query() query: any,
  ): string {
    console.log('Request:', request.user, params, query);
    return this.appService.getHello();
  }
}
