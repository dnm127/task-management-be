import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './module/user/user.module';
import { TaskModule } from './module/task/task.module';
import { FileUploadService } from './services/fileUploadService';
import { AuthModule } from './module/authentication/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    UserModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [FileUploadService, AppService],
})
export class AppModule {}
