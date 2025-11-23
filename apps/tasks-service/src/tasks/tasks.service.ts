import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskPriority, TaskType } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  findAll(userId: number) {
    return this.taskRepository.find({ where: { userId } });
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.update(id, updateTaskDto);
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }

  async createFromTemplate(userId: number, profileType: string) {
    const tasksToCreate: Partial<Task>[] = [];

    if (profileType === 'STUDENT') {
      tasksToCreate.push(
        { title: 'Study', type: TaskType.DAILY, priority: TaskPriority.HIGH, userId, isCompleted: false },
        { title: 'Read', type: TaskType.DAILY, priority: TaskPriority.MEDIUM, userId, isCompleted: false },
      );
    } else if (profileType === 'FITNESS') {
      tasksToCreate.push(
        { title: 'Workout', type: TaskType.DAILY, priority: TaskPriority.HIGH, userId, isCompleted: false },
        { title: 'Meal Prep', type: TaskType.WEEKLY, priority: TaskPriority.MEDIUM, userId, isCompleted: false },
      );
    } else if (profileType === 'WORK') {
      tasksToCreate.push(
        { title: 'Check Emails', type: TaskType.DAILY, priority: TaskPriority.MEDIUM, userId, isCompleted: false },
        { title: 'Team Meeting', type: TaskType.WEEKLY, priority: TaskPriority.HIGH, userId, isCompleted: false },
      );
    }

    if (tasksToCreate.length > 0) {
      const tasks = this.taskRepository.create(tasksToCreate);
      return this.taskRepository.save(tasks);
    }
  }
}
