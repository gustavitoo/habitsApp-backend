import { Injectable, Inject, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const newUser = await firstValueFrom(
        this.usersClient.send('createUser', registerDto)
      );

      return this.signToken(newUser.id, newUser.email);

    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await firstValueFrom(
        this.usersClient.send('findByEmailForAuth', loginDto.email)
      );

      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      return this.signToken(user.id, user.email);

    } catch (error) {
      throw new UnauthorizedException(error.message || 'Credenciales inválidas');
    }
  }

  private signToken(userId: number, email: string): { access_token: string } {
    const payload = { sub: userId, email: email };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken };
  }
}