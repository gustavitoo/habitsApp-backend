import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskType } from '../entities/task.entity';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TaskType)
    @IsOptional()
    type?: TaskType;

    @IsString()
    @IsOptional()
    specificTime?: string;

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
