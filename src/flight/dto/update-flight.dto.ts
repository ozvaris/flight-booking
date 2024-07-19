import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateFlightDto {
  @IsString()
  @IsOptional()
  airline?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;

  @IsDate()
  @IsOptional()
  departureTime?: Date;

  @IsDate()
  @IsOptional()
  arrivalTime?: Date;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  duration?: string;
}