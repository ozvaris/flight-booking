import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from '../user/user.entity';
import { Flight } from '../flight/flight.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { flightId, userId } = createBookingDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const flight = await this.flightRepository.findOne({ where: { id: flightId } });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    const booking = this.bookingRepository.create({
      user,
      flight,
      bookingDate: new Date(),
      status: 'CONFIRMED',
    });

    await this.bookingRepository.save(booking);
    // Add email confirmation logic here

    return booking;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['flight'],
    });
  }

  async getBookingById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id }, relations: ['user', 'flight'] });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${booking} not found`);
    }

    return booking;
  }

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    await this.bookingRepository.update(id, updateBookingDto);
    return this.bookingRepository.findOne({ where: { id }, relations: ['flight'] });
  }

  async deleteBooking(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }
}