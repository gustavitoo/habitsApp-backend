import { Controller, Post, Body, UsePipes, ValidationPipe, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { LoginDto, CreateUserDto } from '@app/common'; 
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerDto: CreateUserDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}