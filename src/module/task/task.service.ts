import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, getRepository, DeleteResult } from 'typeorm';
// import { UserEntity } from './user.entity';
import { DataSource } from 'typeorm';
import { TaskData } from './interfaces/task.interface';
import { CreateTaskDto, EditTaskDto } from './dto/task.dto';
import * as moment from 'moment';

@Injectable()
export class TaskService {
  constructor(
    // @InjectRepository(UserEntity)
    // private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}
  async findAll(): Promise<Array<TaskData>> {
    const queryRunner = this.dataSource.createQueryRunner();
    const result = await queryRunner.query('SELECT * FROM task');
    return result;
  }

  async findOneById(id: string): Promise<Array<TaskData>> {
    const queryRunner = this.dataSource.createQueryRunner();
    const queryString = `SELECT id, title, status, description, created_date, expiration, user_id FROM task WHERE id::text = '${id}'`;
    const result = await queryRunner.query(queryString);
    return result;
  }

  async addTask(body: CreateTaskDto): Promise<any> {
    const { title, description, expiration, user_id } = body;
    const queryRunner = this.dataSource.createQueryRunner();
    const queryString = `INSERT INTO task (title, status, description, created_date, expiration, user_id) VALUES ('${title}','active',${
      description ? `'${description}'` : `''`
    },'${moment().format('MM-DD-YYYY HH:mm')}',${
      expiration ? `'${moment(expiration).format('MM-DD-YYYY HH:mm')}'` : 'null'
    },${user_id ? `'${user_id}'` : `null`})`;
    const result = await queryRunner.query(queryString);
    return result;
  }

  async editTask(id: string, body: EditTaskDto): Promise<TaskData> {
    const { title, description, expiration, status, user_id } = body;
    const queryRunner = this.dataSource.createQueryRunner();
    // const queryString = `UPDATE task SET title = ${title}, status = '${status}', expiration = '${expiration}', description = '${description}', user_id = '${user_id}' WHERE id::text = '${id}'`;
    let queryString = `UPDATE task SET `;
    if (title) {
      queryString += `title = '${title}'`;
    }
    if (description) {
      queryString += `, description = '${description}'`;
    }
    if (expiration) {
      queryString += `, expiration = '${expiration}'`;
    }
    if (status) {
      queryString += `, status = '${status}'`;
    }
    if (user_id) {
      queryString += `, user_id = '${user_id}'`;
    }
    queryString += ` WHERE id::text = '${id}';`;
    const result = await queryRunner.query(queryString);
    return result;
  }

  async deleteTask(id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    const queryString = `DELETE FROM task WHERE id='${id}'`;
    const result = await queryRunner.query(queryString);
    return result;
  }
}
