import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UserRole } from '@app/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CustomRpcException } from '@app/common/exceptions/rpc-exceptions.class';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { name, email, password, role } = createUserDto;

    const emailExists = await this.findByEmail(email);
    if (emailExists) {
      throw new CustomRpcException(409, 'El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
    });
    
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailForAuth(email: string): Promise<UserEntity | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async viewProfile(userId: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    this.usersRepository.merge(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomRpcException(404, `Usuario con ID ${id} no encontrado.`);
    }

    await this.usersRepository.remove(user);
    
    return { deleted: true, id };
  }
}