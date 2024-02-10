import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
// import { UserEntity } from './user.entity';
import { DataSource } from 'typeorm';
import { UserData } from './interfaces/user.interface';
import { CreateUserDto } from './dto/user.dto';
import * as S3 from 'aws-sdk/clients/s3';
import { FileUploadService } from 'src/services/fileUploadService';

@Injectable()
export class UserService {
  constructor(
    // @InjectRepository(UserEntity)
    // private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private fileUploadService: FileUploadService,
  ) {}

  async findAll(): Promise<Array<UserData>> {
    const queryRunner = this.dataSource.createQueryRunner();
    const result = await queryRunner.query('SELECT * FROM app_user');
    return result;
  }

  async findOneByUsername(username: string): Promise<Array<UserData>> {
    const queryRunner = this.dataSource.createQueryRunner();
    const result = await queryRunner.query(
      `SELECT username, profile_image, bio FROM app_user WHERE username='${username}'`,
    );
    return result;
  }

  async getUserDataByUsername(username: string): Promise<Array<UserData>> {
    const queryRunner = this.dataSource.createQueryRunner();
    const result = await queryRunner.query(
      `SELECT * FROM app_user WHERE username='${username}'`,
    );
    return result;
  }

  async findOneById(id: string): Promise<Array<UserData>> {
    const queryRunner = this.dataSource.createQueryRunner();
    // const queryString = `SELECT username, profile_image, bio FROM app_user WHERE id::text = '${id}'`;
    const queryString = `SELECT username, profile_image, bio FROM app_user WHERE id::text = '${id}'`;
    const result = await queryRunner.query(queryString);
    return result;
  }

  async addUser(user: CreateUserDto): Promise<any> {
    const { username, password, profile_image, bio } = user;
    const queryRunner = this.dataSource.createQueryRunner();
    const queryString = `INSERT INTO app_user(id, username, password, profile_image, bio) 
    VALUES (
      uuid_generate_v4(), 
      '${username}',
      '${password}',
      ${profile_image ? `${profile_image}` : 'NULL'},
      ${bio ? `'${bio}'` : 'NULL'}
    )`;
    const result = await queryRunner.query(queryString);
    return result;
  }

  async updateUser(user: UserData): Promise<any> {
    const { id, username, profile_image, bio } = user;
    const queryRunner = this.dataSource.createQueryRunner();
    const queryString = `UPDATE app_user SET username = '${username}', profile_image = '${profile_image}', bio = '${bio}' WHERE id::text = '${id}'`;
    const result = await queryRunner.query(queryString);
    return result;
  }

  async deleteUserById(id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    const queryString = `DELETE FROM app_user WHERE id='${id}'`;
    const result = await queryRunner.query(queryString);
    return result;
  }

  async uploadProfileImage(userId: string, file: any) {
    const fileUploadResponse: any = await this.fileUploadService.upload(
      userId,
      file,
    );
    const { Location } = fileUploadResponse;
    const queryRunner = this.dataSource.createQueryRunner();
    const queryString = `UPDATE app_user SET profile_image = '${Location}' WHERE id::text = '${userId}'`;
    console.log('fileUploadResponse', fileUploadResponse);
    const result = await queryRunner.query(queryString);
    return result;
  }
}
