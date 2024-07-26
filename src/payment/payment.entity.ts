// src/payment/payment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Booking } from '../booking/booking.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Payment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  stripePaymentId: string;

  @Field()
  @Column()
  amount: number;

  @Field()
  @Column()
  currency: string;

  @Field()
  @Column()
  status: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Booking)
  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Field()
  @Column()
  createdAt: Date;
}
