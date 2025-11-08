import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto, CreateUserDto } from '@app/common'; 
import { AuthService } from './auth.service';
import { handleRpcError } from '@app/common/utils/handle-rpc-error';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerDto: CreateUserDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      handleRpcError('auth-service', error);
    }
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      handleRpcError('auth-service', error);
    }
  }
}