import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FileUploadService } from 'src/services/fileUploadService';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({})],
  providers: [UserService, FileUploadService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
