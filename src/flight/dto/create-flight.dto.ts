import { IsString, IsDate, IsNumber } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  airline: string;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsDate()
  departureTime: Date;

  @IsDate()
  arrivalTime: Date;

  @IsNumber()
  price: number;

  @IsString()
  duration: string;
}