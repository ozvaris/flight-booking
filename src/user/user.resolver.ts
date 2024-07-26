// src/user/user.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => [User])
  async users() {
    return this.userService.getUsers();
  }

  @Mutation(returns => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }
}
