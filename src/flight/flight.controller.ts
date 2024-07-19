// src/flight/flight.controller.ts
import { Controller, Get, Query, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { FlightService } from './flight.service';
import { SearchFlightDto } from './dto/search-flight.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Controller('flights')
export class FlightController {
  constructor(private flightService: FlightService) {}

  @Get()
  searchFlights(@Query() searchFlightDto: SearchFlightDto) {
    return this.flightService.searchFlights(searchFlightDto);
  }

  @Get(':id')
  getFlightById(@Param('id') id: number) {
    return this.flightService.getFlightById(id);
  }

  @Post()
  createFlight(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.createFlight(createFlightDto);
  }

  @Put(':id')
  updateFlight(@Param('id') id: number, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightService.updateFlight(id, updateFlightDto);
  }

  @Delete(':id')
  deleteFlight(@Param('id') id: number) {
    return this.flightService.deleteFlight(id);
  }
}