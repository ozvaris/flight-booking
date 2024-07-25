// src/auth/auth.controller.ts

import { Injectable, UnauthorizedException, NotFoundException, HttpCode } from '@nestjs/common';
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserWithoutPassword } from './user-without-password.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: User}> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: UserWithoutPassword}> {

    try {
      const user: UserWithoutPassword = await this.authService.validateUser(authCredentialsDto.email, authCredentialsDto.password);
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('User not found');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }


  }
}