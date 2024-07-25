// src/admin/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../booking/booking.entity';
import { User } from '../user/user.entity';
import { Flight } from '../flight/flight.entity';
import { Payment } from '../payment/payment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async getOverview() {
    const totalBookings = await this.bookingRepository.count();
    const totalUsers = await this.userRepository.count();
    const totalFlights = await this.flightRepository.count();
    const totalRevenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'sum')
      .getRawOne();

    return {
      totalBookings,
      totalUsers,
      totalFlights,
      totalRevenue: totalRevenue.sum || 0,
    };
  }
}