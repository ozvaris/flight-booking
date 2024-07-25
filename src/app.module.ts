// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FlightModule } from './flight/flight.module';
import { BookingModule } from './booking/booking.module';
import { User } from './user/user.entity';
import { Flight } from './flight/flight.entity';
import { Booking } from './booking/booking.entity';
import { PaymentModule } from './payment/payment.module';
import { Payment } from './payment/payment.entity';
import { ReviewModule } from './review/review.module';
import { RatingModule } from './rating/rating.module';
import { Review } from './review/review.entity';
import { Rating } from './rating/rating.entity';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_NAME : process.env.DATABASE_NAME,
      synchronize: true,
      host: process.env.DATABASE_HOST,
      port:  parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [User, Flight, Booking, Payment, Review, Rating],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UserModule,
    FlightModule,
    BookingModule,
    PaymentModule,
    ReviewModule,
    RatingModule,
    AdminModule
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}

// console.log('NODE_ENV:', process.env.NODE_ENV);
// if (process.env.NODE_ENV !== 'test') {
//   console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
//   console.log('DATABASE_PORT:', process.env.DATABASE_PORT);
//   console.log('DATABASE_USERNAME:', process.env.DATABASE_USERNAME);
//   console.log('DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD);
//   console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
// }


