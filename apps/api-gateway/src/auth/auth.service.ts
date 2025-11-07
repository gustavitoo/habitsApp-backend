import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, CreateUserDto } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async register(registerDto: CreateUserDto) {
    return await firstValueFrom(
      this.authClient.send('register', registerDto)
    );
  }

  async login(loginDto: LoginDto) {
    return await firstValueFrom(
      this.authClient.send('login', loginDto)
    );
  }
}