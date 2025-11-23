import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @MessagePattern('create_task')
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @MessagePattern('find_all_tasks')
  findAll(@Payload() userId: number) {
    return this.tasksService.findAll(userId);
  }

  @MessagePattern('find_one_task')
  findOne(@Payload() id: number) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern('update_task')
  update(@Payload() payload: { id: number; updateTaskDto: UpdateTaskDto }) {
    return this.tasksService.update(payload.id, payload.updateTaskDto);
  }

  @MessagePattern('remove_task')
  remove(@Payload() id: number) {
    return this.tasksService.remove(id);
  }
}
