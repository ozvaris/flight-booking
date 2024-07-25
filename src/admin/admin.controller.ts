import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { FlightService } from 'src/flight/flight.service';
import { CreateFlightDto } from 'src/flight/dto/create-flight.dto';
import { UpdateFlightDto } from 'src/flight/dto/update-flight.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { DashboardService } from './dashboard.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private dashboardService: DashboardService,
    private readonly userService: UserService,
    private readonly flightService: FlightService
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return this.dashboardService.getOverview();
  }

  @Get('flights')
  async getFlights() {
    return this.flightService.getFlights();
  }

  @Post('flights')
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.createFlight(createFlightDto);
  }

  @Put('flights/:id')
  async updateFlight(@Param('id') id: number, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightService.updateFlight(id, updateFlightDto);
  }

  @Delete('flights/:id')
  async deleteFlight(@Param('id') id: number) {
    return this.flightService.deleteFlight(id);
  }

  @Get('users')
  async getUsers() {
    return this.userService.getUsers();
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }


}
