import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AdminController } from './admin.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { FlightService } from 'src/flight/flight.service';
import { Flight } from 'src/flight/flight.entity';
import { Booking } from 'src/booking/booking.entity';
import { Payment } from 'src/payment/payment.entity';
import { BookingService } from 'src/booking/booking.service';
import { PaymentService } from 'src/payment/payment.service';
import { DashboardService } from './dashboard.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Flight, Booking, Payment]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [UserService, FlightService, UserRepository, DashboardService, AuthService, JwtStrategy],
})
export class AdminModule {}
