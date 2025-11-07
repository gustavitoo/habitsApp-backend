import { Module } from '@nestjs/common';
import { UsersServiceController } from './users-service.controller';
import { UsersServiceService } from './users-service.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UsersServiceController],
  providers: [UsersServiceService],
})
export class UsersServiceModule {}
