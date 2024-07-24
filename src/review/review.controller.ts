// src/review/review.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  async addReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.addReview(createReviewDto);
  }

  @Get('flight/:flightId')
  async getReviewsByFlight(@Param('flightId') flightId: number) {
    return this.reviewService.getReviewsByFlight(flightId);
  }
}
