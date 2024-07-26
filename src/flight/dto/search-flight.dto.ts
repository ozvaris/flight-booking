// src/flight/dto/search-flight.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsDate, IsNumber } from 'class-validator';

@InputType()
export class SearchFlightDto {
  @Field()
  @IsString()
  from: string;

  @Field()
  @IsString()
  to: string;

  @Field()
  @IsDate()
  departureDate: Date;

  @Field({ nullable: true })
  @IsDate()
  returnDate?: Date;
}
