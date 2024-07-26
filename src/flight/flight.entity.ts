import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Flight {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  airline: string;

  @Field()
  @Column()
  from: string;

  @Field()
  @Column()
  to: string;

  @Field()
  @Column()
  departureTime: Date;

  @Field()
  @Column()
  arrivalTime: Date;

  @Field()
  @Column('decimal')
  price: number;

  @Field()
  @Column()
  duration: string;

  @Field()
  @Column({ default: 0 })
  availability: number;
}
