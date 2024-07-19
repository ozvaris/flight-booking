// src/booking/booking.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Flight } from '../flight/flight.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'flightId' })
  flight: Flight;

  @Column()
  bookingDate: Date;

  @Column()
  status: string;
  
}