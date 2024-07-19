// src/booking/booking.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Put, Delete, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { User } from 'src/user/user.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: RequestWithUser,) {
    const user = req.user as User; // user Info come from JWT
    createBookingDto.userId = user.id;
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get('user/:userId')
  getBookingsByUserId(@Param('userId') userId: number) {
    return this.bookingService.getBookingsByUserId(userId);
  }

  @Get(':id')
  getBookingById(@Param('id') id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Put(':id')
  updateBooking(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Delete(':id')
  deleteBooking(@Param('id') id: number) {
    return this.bookingService.deleteBooking(id);
  }
}