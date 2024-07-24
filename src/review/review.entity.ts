// src/rating/entities/rating.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity'; // User entity'sinin doğru yolu
import { Flight } from '../flight/flight.entity'; // Flight entity'sinin doğru yolu

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'flightId' })
  flight: Flight;

  @CreateDateColumn()
  createdAt: Date;
}
