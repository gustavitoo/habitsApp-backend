import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findByIdUser')
  findById(@Payload() id: number) {
    return this.usersService.findById(id);
  }

  @MessagePattern('findByEmailUser')
  findByEmail(@Payload() email: string) {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern('findByEmailForAuth')
  findByEmailForAuth(@Payload() email: string) {
    return this.usersService.findByEmailForAuth(email);
  }

  @MessagePattern('updateUser')
  update(@Payload() payload: { id: number, updateUserDto: UpdateUserDto }) {
    return this.usersService.update(payload.id, payload.updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}