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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Response } from 'express';
import { CreateTaskDto, EditTaskDto } from './dto/task.dto';
import { TaskData } from './interfaces/task.interface';
import { AuthGuard } from '../authentication/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('')
  async findAllTask(@Res() response: Response) {
    try {
      // const result: Array<TaskData> = await this.taskService.findAll();
      // if (!result) {
      //   throw new HttpException(
      //     'Error getting all tasks',
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // } else if (result && result.length === 0) {
      //   throw new NotFoundException('No tasks found');
      // }
      // return response.status(200).send(result);
      return response.status(200).send([
        {
          id: '0130dc29-f9b3-4bc3-9604-630df051c6a7',
          title: 'task 10',
          status: 'doing',
          description: 'My task description',
          expiration: '2024-02-15T05:26:04.128Z',
          user_id: 'c9750edc-b244-4828-9d83-ce7f93b419de',
          created_date: '2024-01-05T08:16:00.000Z',
        },
        {
          id: '1639189a-b8eb-480b-bdc3-9d6a7eb83312',
          title: 'test',
          status: 'active',
          description: 'Description 1',
          expiration: '2024-02-15T05:26:04.128Z',
          user_id: 'c9750edc-b244-4828-9d83-ce7f93b419de',
          created_date: '2023-12-27T09:16:00.000Z',
        },
        {
          id: '78baee1e-2628-4942-98b0-ecddbb100b36',
          title: 'test',
          status: 'active',
          description: 'Description 2',
          expiration: '2024-03-15T05:26:04.128Z',
          user_id: 'c9750edc-b244-4828-9d83-ce7f93b419de',
          created_date: '2023-12-27T09:17:00.000Z',
        },
        {
          id: '976d75bb-0f65-40fe-8ace-ff55ce1c48f0',
          title: 'task name edited',
          status: 'done',
          description: 'task description',
          expiration: '2024-06-10T05:26:04.128Z',
          user_id: 'bfff4f7a-d814-42ad-b1fd-5599d156ee37',
          created_date: '2023-12-27T04:00:00.000Z',
        },
        {
          id: 'dcbc00ea-ec86-4b83-89b1-3275c0879b73',
          title: 'task 1',
          status: 'active',
          description: 'Description 3',
          expiration: '2024-04-10T05:26:04.128Z',
          user_id: 'c9750edc-b244-4828-9d83-ce7f93b419de',
          created_date: '2023-12-27T10:30:00.000Z',
        },
      ]);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Get(':id')
  async findOneTask(@Param('id') id: string, @Res() response: Response) {
    try {
      const result: Array<TaskData> = await this.taskService.findOneById(id);
      if (!result) {
        throw new HttpException(
          'Error getting task with given id',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (result && result.length === 0) {
        throw new NotFoundException('No tasks found');
      }
      return response.status(HttpStatus.OK).send(result);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Post('')
  async addTask(@Res() response: Response, @Body() body: CreateTaskDto) {
    try {
      const result: any = await this.taskService.addTask(body);
      if (!result) {
        throw new HttpException(
          'Error creating tasks',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return response.status(HttpStatus.CREATED).send(body);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Put(':id')
  async editTask(
    @Res() response: Response,
    @Body() body: EditTaskDto,
    @Param('id') id: string,
  ) {
    try {
      const existingTask: TaskData[] = await this.taskService.findOneById(id);
      if (!existingTask || existingTask.length === 0) {
        throw new NotFoundException(`Task ${id} not found`);
      }
      const result: TaskData = await this.taskService.editTask(id, {
        title: body.title ? body.title : existingTask[0].title,
        status: body.status ? body.status : existingTask[0].status,
        expiration: body.expiration
          ? body.expiration
          : existingTask[0].expiration,
        description: body.description
          ? body.description
          : existingTask[0].description,
        user_id: body.user_id ? body.user_id : existingTask[0].user_id,
      });
      return response.status(HttpStatus.OK).send(result);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Res() response: Response) {
    try {
      const result: TaskData = await this.taskService.deleteTask(id);
      return response.status(HttpStatus.OK).send(result);
    } catch (error: any) {
      throw new BadRequestException(`Bad request: ${error}`);
    }
  }
}
