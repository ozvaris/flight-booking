// src/rating/entities/rating.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity'; // User entity'sinin doğru yolu
import { Flight } from '../flight/flight.entity'; // Flight entity'sinin doğru yolu

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  score: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'flightId' })
  flight: Flight;

  @CreateDateColumn()
  createdAt: Date;
}
