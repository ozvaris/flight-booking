// src/payment/payment.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { User } from '../user/user.entity';
import { Booking } from '../booking/booking.entity';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  async processPayment(userId: number, bookingId: number, token: string): Promise<Payment> {
    const user = await this.userRepository.findOne({ where: { id : userId } });
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }

    const booking = await this.bookingRepository.findOne({ where: { id : bookingId } });
    if (!booking) {
      throw new BadRequestException(`Booking with ID ${bookingId} not found`);
    }

    const amount = 1000; // Amount in cents
    const currency = 'usd';

    const charge = await this.stripe.charges.create({
      amount,
      currency,
      source: token,
      description: `Payment for booking ${bookingId}`,
      receipt_email: user.email,
    });

    const payment = this.paymentRepository.create({
      stripePaymentId: charge.id,
      amount,
      currency,
      status: charge.status,
      user,
      booking,
      createdAt: new Date(),
    });

    return this.paymentRepository.save(payment);
  }

  async getPaymentHistory(userId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { user: { id: userId } },
      relations: ['booking'],
      order: { createdAt: 'DESC' },
    });
  }
}
