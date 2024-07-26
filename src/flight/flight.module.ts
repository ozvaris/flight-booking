// src/flight/flight.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { Flight } from './flight.entity';
import { FlightResolver } from './flight.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Flight])],
  providers: [FlightService, FlightResolver],
  controllers: [FlightController],
  exports: [FlightService],
})
export class FlightModule {}