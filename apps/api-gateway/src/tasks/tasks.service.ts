import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_SERVICE') private readonly client: ClientProxy,
  ) { }

  create(createTaskDto: CreateTaskDto, userId: number) {
    return this.client.send('create_task', { ...createTaskDto, userId });
  }

  findAll(userId: number) {
    return this.client.send('find_all_tasks', userId);
  }

  findOne(id: number) {
    return this.client.send('find_one_task', id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.client.send('update_task', { id, updateTaskDto });
  }

  remove(id: number) {
    return this.client.send('remove_task', id);
  }
}
