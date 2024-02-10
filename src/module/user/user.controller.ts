import {
  Get,
  Controller,
  Res,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/user.dto';
import { UserData } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../authentication/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async findAllUsers(@Res() response: Response) {
    try {
      const result: Array<UserData> = await this.userService.findAll();
      if (!result) {
        throw new HttpException(
          'Error getting all users',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (result && result.length === 0) {
        throw new NotFoundException('No users found');
      }
      return response.status(200).send(result);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Get('users/:id')
  async findOneUser(@Param('id') id: string, @Res() response: Response) {
    try {
      const result: Array<UserData> = await this.userService.findOneById(id);
      if (!result) {
        throw new NotFoundException('no user with given id');
      }
      return response.status(HttpStatus.CREATED).send(result);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Post('users')
  async addUser(
    @Body() body: CreateUserDto,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const { username, password } = body;
      const existingUsers = await this.userService.findOneByUsername(username);
      if (existingUsers && existingUsers.length > 0) {
        throw new ConflictException('User name already existed');
      }
      const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
      await this.userService.addUser({ ...body, password: hash });
      const result = await this.userService.findOneByUsername(username);
      return response.status(HttpStatus.CREATED).send(result);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: any,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const existingUsers: Array<UserData> =
        await this.userService.findOneById(id);
      if (!existingUsers || existingUsers.length === 0) {
        throw new NotFoundException(`User ${id} not found`);
      } else {
        const result = await this.userService.updateUser({
          id,
          ...existingUsers[0],
          ...body,
        });
        if (!result) {
          throw new HttpException(
            'Error editing users',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return response.status(HttpStatus.ACCEPTED).send(body);
      }
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Delete('users/:id')
  async delete(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await this.userService.deleteUserById(id);
      if (!result) {
        throw new HttpException(
          'Error deleting user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return response.status(HttpStatus.OK).send({ message: 'success' });
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Post('users/upload-profile-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadProfileImage(id, file);
  }
}
