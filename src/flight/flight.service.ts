// src/flight/flight.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';
import { SearchFlightDto } from './dto/search-flight.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async searchFlights(searchFlightDto: SearchFlightDto): Promise<Flight[]> {
    const { from, to, departureDate, returnDate } = searchFlightDto;
    const query = this.flightRepository.createQueryBuilder('flight')
      .where('flight.from = :from', { from })
      .andWhere('flight.to = :to', { to })
      .andWhere('DATE(flight.departureTime) = :departureDate', { departureDate });

    if (returnDate) {
      query.andWhere('DATE(flight.arrivalTime) = :returnDate', { returnDate });
    }

    return query.getMany();
  }

  async getFlights(): Promise<Flight[]> {
    return this.flightRepository.find();
  }

  async getFlightById(id: number): Promise<Flight> {

    const flight = await this.flightRepository.findOne({ where: { id } });

   if (!flight) {
      throw new NotFoundException(`Flight with ID ${flight} not found`);
    }

    return flight;
  }

  async createFlight(createFlightDto: CreateFlightDto): Promise<Flight> {
    const flight = this.flightRepository.create(createFlightDto);
    return this.flightRepository.save(flight);
  }

 async updateFlight(id: number, updateFlightDto: UpdateFlightDto): Promise<Flight> {
    const flight = await this.flightRepository.preload({
      id,
      ...updateFlightDto,
    });

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }

    return this.flightRepository.save(flight);
  }

  async deleteFlight(id: number): Promise<void> {
    const result = await this.flightRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
  }

}