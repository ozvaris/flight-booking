// src/payment/payment.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('process')
  async processPayment(@Body('userId') userId: number, @Body('bookingId') bookingId: number, @Body('token') token: string) {
    return this.paymentService.processPayment(userId, bookingId, token);
  }

  @Get('history/:userId')
  async getPaymentHistory(@Param('userId') userId: number) {
    return this.paymentService.getPaymentHistory(userId);
  }
}