import { IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsDate()
  @IsOptional()
  bookingDate?: Date;

  @IsString()
  @IsOptional()
  status?: string;
}
