import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskType,
        default: TaskType.DAILY,
    })
    type: TaskType;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ nullable: true })
    specificTime: string;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;

    @Column()
    userId: number;
}
