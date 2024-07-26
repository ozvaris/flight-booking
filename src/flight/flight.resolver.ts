import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';

@Resolver(() => Flight)
export class FlightResolver {
  constructor(private readonly flightService: FlightService) {}

  @Query(() => [Flight], { name: 'searchFlights' })
  async searchFlights(
    @Args('searchFlightDto') searchFlightDto: SearchFlightDto,
  ): Promise<Flight[]> {
    return this.flightService.searchFlights(searchFlightDto);
  }

  @Query(() => [Flight], { name: 'flights' })
  async getFlights(): Promise<Flight[]> {
    return this.flightService.getFlights();
  }

  @Query(() => Flight, { name: 'flight' })
  async getFlightById(@Args('id', { type: () => Int }) id: number): Promise<Flight> {
    return this.flightService.getFlightById(id);
  }

  @Mutation(() => Flight)
  async createFlight(
    @Args('createFlightDto') createFlightDto: CreateFlightDto,
  ): Promise<Flight> {
    return this.flightService.createFlight(createFlightDto);
  }

  @Mutation(() => Flight)
  async updateFlight(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateFlightDto') updateFlightDto: UpdateFlightDto,
  ): Promise<Flight> {
    return this.flightService.updateFlight(id, updateFlightDto);
  }

  @Mutation(() => Boolean)
  async deleteFlight(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.flightService.deleteFlight(id);
    return true;
  }
}
