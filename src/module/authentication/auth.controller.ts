import {
  Body,
  Controller,
  Post,
  Get,
  HttpStatus,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() body: SignInDto, @Res() response: Response) {
    const { username, password } = body;
    try {
      const result = await this.authService.signIn(username, password);
      return response.status(HttpStatus.OK).send({ ...result });
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Get('current-user')
  async getCurrentUser(@Req() request: Request, @Res() response: Response) {
    try {
      const token = request.headers['authorization'].split('Bearer ')[1] || '';
      const result = await this.authService.getCurrentUser(token);
      console.log('result', result);
      if (result) {
        console.log('return');
        return response.status(HttpStatus.OK).send({ ...result });
      } else {
        return response.status(HttpStatus.UNAUTHORIZED).send();
      }
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }
}
