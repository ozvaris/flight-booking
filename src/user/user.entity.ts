// src/user/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../booking/booking.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  facebookId: string;

  @Column("simple-array", { default: "user" })
  @Field(type => [String])
  roles: string[];

  @OneToMany(() => Booking, booking => booking.user)
  @Field(type => [Booking], { nullable: true })
  bookings: Booking[];

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field()
  updatedAt: Date;
}
