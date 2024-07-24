// src/rating/rating.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { User } from '../user/user.entity';
import { Flight } from '../flight/flight.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async addRating(createRatingDto: CreateRatingDto): Promise<Rating> {
    const { userId, flightId, score } = createRatingDto;

    const user = await this.userRepository.findOne({ where: { id : userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const flight = await this.flightRepository.findOne({ where: { id : flightId } });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    const rating = this.ratingRepository.create({
      score,
      user,
      flight,
      createdAt: new Date(),
    });

    return this.ratingRepository.save(rating);
  }

  async getRatingsByFlight(flightId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { flight: { id: flightId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}