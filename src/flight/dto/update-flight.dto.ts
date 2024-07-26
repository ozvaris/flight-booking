import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UpdateFlightDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  airline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  from?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  to?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  departureTime?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  arrivalTime?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  duration?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  availability?: number;
}
