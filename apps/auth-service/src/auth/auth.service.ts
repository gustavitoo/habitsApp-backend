import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@app/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { CustomRpcException } from '@app/common/exceptions/rpc-exceptions.class';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: CreateUserDto) {
    try {
      const newUser = await firstValueFrom(
        this.usersClient.send('createUser', registerDto)
      );

      return this.signToken(newUser.id, newUser.email);

    } catch (error) {
      const statusCode = error?.statusCode ?? 500;
      const message = error?.message ?? 'Error interno en user-service';
      throw new CustomRpcException(statusCode, message);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await firstValueFrom(
      this.usersClient.send('findByEmailForAuth', loginDto.email)
    );

    if (!user) {
      throw new CustomRpcException(409, 'Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new CustomRpcException(409, 'Credenciales inválidas');
    }

    return this.signToken(user.id, user.email);
  }

  private signToken(userId: number, email: string): { access_token: string } {
    const payload = { sub: userId, email: email };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken };
  }
}