// src/review

// review.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './review.entity';
import { User } from '../user/user.entity';
import { Flight } from '../flight/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Flight])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
