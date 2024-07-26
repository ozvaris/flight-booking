// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserWithoutPassword } from '../auth/user-without-password.interface';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  private users: User[] = [];

  async getProfile(userId: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findUserWithoutPassword(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user as UserWithoutPassword;
  }

  async getUsers(): Promise<UserWithoutPassword[]> {
    const users = await this.userRepository.findUserWithoutPassword(null);

    return users as UserWithoutPassword[];
  }

  create(createUserInput: CreateUserInput): User {
    const newUser = {
      ...createUserInput,
      id: this.users.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return this.users.find(user => user.id === id);
  }


  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File): Promise<UserWithoutPassword> {
    const user = await this.getProfile(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (file) {
      const oldProfilePicture = user.profilePicture;
      const newProfilePicture = file.filename;

      // Delete old picture
      if (oldProfilePicture) {
        const oldPath = path.join(__dirname, '..', '..', oldProfilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Update picture
      updateProfileDto.profilePicture = (process.env.NODE_ENV === 'test' ? process.env.TEST_UPLOAD_DIRECTORY : process.env.UPLOAD_DIRECTORY) + newProfilePicture;
      
    }

    await this.userRepository.update(userId, { ...updateProfileDto, updatedAt: new Date() });
    return this.getProfile(userId);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }


}