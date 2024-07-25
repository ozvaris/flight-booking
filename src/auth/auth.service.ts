// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserWithoutPassword } from './user-without-password.interface';
import logger from 'src/utils/elkStack';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: User }>  {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({ email, password: hashedPassword, roles: ['user'] });
    try {
      await this.userRepository.save(user);
      const payload: JwtPayload = { email: user.email, sub: user.id, roles: user.roles };
      const accessToken = this.jwtService.sign(payload);
      logger.info(`User Sign up: ${user.email}`, { event_type: 'signup', tag: 'signup', user_email: user.email });
      return { accessToken, user };
    } catch (error) {
      console.error('Error code:', error.code); 
      console.error('Sign Up Error:', error);
      if (error.code === '23505') { 
        throw new ConflictException('This user already exists');
      } else {
        logger.error(`Error logging in user: ${user.email}`, error, { event_type: 'signup', tag: 'signup', user_email: user.email });
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserByJwt(email: string): Promise<UserWithoutPassword | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const { password, ...result } = user; // Exclude the password from the result
    return result;
  }

  async validateUser(email: string, pass: string): Promise<UserWithoutPassword | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    // console.log("4 - validateUser %s %s", pass, user.password)

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user;

    return result;
  }

  async login(user: UserWithoutPassword): Promise<{ accessToken: string, user: UserWithoutPassword}> {
    // console.log("2 - login " + user.email)
    const payload: JwtPayload = { email: user.email, sub: user.id, roles: user.roles };
    
    try {
      const accessToken = this.jwtService.sign(payload);
      logger.info(`User logged in: ${user.email}`, { event_type: 'login', tag: 'login', user_email: user.email });
      return { accessToken, user };
    } catch (error) {
      logger.error(`Error logging in user: ${user.email}`, error, { event_type: 'login', tag: 'login', user_email: user.email });
      throw new HttpException(`Failed to logged in ${user.email}: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
