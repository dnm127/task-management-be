import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  description: string;

  expiration: Date;

  user_id: string;
}

export class EditTaskDto {
  title: string;

  status: string;

  description: string;

  expiration: Date;

  user_id: string;
}
