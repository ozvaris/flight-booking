// src/user/dto/create-user.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  googleId?: string;

  @Field({ nullable: true })
  facebookId?: string;

  @Field(type => [String], { defaultValue: ["user"] })
  roles?: string[];
}
