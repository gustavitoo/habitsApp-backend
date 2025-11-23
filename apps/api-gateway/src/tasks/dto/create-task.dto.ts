import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TaskType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

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
}
