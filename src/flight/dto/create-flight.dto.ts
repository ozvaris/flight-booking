import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsDate, IsNumber } from 'class-validator';

@InputType()
export class CreateFlightDto {
  @Field()
  @IsString()
  airline: string;

  @Field()
  @IsString()
  from: string;

  @Field()
  @IsString()
  to: string;

  @Field()
  @IsDate()
  departureTime: Date;

  @Field()
  @IsDate()
  arrivalTime: Date;

  @Field()
  @IsNumber()
  price: number;

  @Field()
  @IsString()
  duration: string;

  @Field({ defaultValue: 0 })
  @IsNumber()
  availability: number;
}
