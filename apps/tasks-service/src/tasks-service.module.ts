import { Module } from '@nestjs/common';
import { TasksServiceController } from './tasks-service.controller';
import { TasksServiceService } from './tasks-service.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: config.get<'postgres'>('DB_TYPE') as any,
        host: config.get<string>('DB_HOST'),
        port: +config.get('DB_PORT') || 5432,
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: config.get<string>('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
    TasksModule
  ],
  controllers: [TasksServiceController],
  providers: [TasksServiceService],
})
export class TasksServiceModule { }
