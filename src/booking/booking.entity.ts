import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Flight } from '../flight/flight.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Booking {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Flight)
  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'flightId' })
  flight: Flight;

  @Field()
  @Column()
  bookingDate: Date;

  @Field()
  @Column()
  status: string;
}
