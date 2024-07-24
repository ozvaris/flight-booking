// src/rating/rating.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post()
  async addRating(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.addRating(createRatingDto);
  }

  @Get('flight/:flightId')
  async getRatingsByFlight(@Param('flightId') flightId: number) {
    return this.ratingService.getRatingsByFlight(flightId);
  }
}

