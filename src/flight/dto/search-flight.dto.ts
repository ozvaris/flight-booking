// src/flight/dto/search-flight.dto.ts
export class SearchFlightDto {
    from: string;
    to: string;
    departureDate: Date;
    returnDate?: Date;
  }