import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
import { Booking } from '../../src/booking/booking.entity';
import { Flight } from '../../src/flight/flight.entity';
import { User } from '../../src/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let bookingRepository: Repository<Booking>;
  let flightRepository: Repository<Flight>;
  let userRepository: Repository<User>;
  let userToken: string;
  let userId: number;
  let flightId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    bookingRepository = moduleFixture.get<Repository<Booking>>(getRepositoryToken(Booking));
    flightRepository = moduleFixture.get<Repository<Flight>>(getRepositoryToken(Flight));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Kullanıcı oluşturma ve token alma
    const signupData = {
      email: 'testuser@example.com',
      password: 'TestPassword123!',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData)
      .expect(201);

    userToken = response.body.accessToken;
    userId = response.body.user.id;

    // Test uçuşu oluşturma
    const flightResponse = await request(app.getHttpServer())
      .post('/flights')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        airline: 'Test Airline',
        from: 'Test From',
        to: 'Test To',
        departureTime: new Date(),
        arrivalTime: new Date(),
        price: 100,
        duration: '2h'
      })
      .expect(201);

    flightId = flightResponse.body.id;
  });

  afterAll(async () => {
    await bookingRepository.clear();
    await flightRepository.createQueryBuilder().delete().from(Flight).execute();
    await userRepository.createQueryBuilder().delete().from(User).execute();

    await app.close();
  });

  beforeEach(async () => {
   
  });

  it('/bookings (POST)', () => {
    return request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        flightId,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.status).toEqual('CONFIRMED');
      });
  });

  it('/bookings/user/:userId (GET)', () => {
    return request(app.getHttpServer())
      .get(`/bookings/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });

  it('/bookings/:id (PUT)', async () => {
    const bookingResponse = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        userId,
        flightId,
        bookingDate: new Date(),
        status: 'confirmed'
      });

    const bookingId = bookingResponse.body.id;

    return request(app.getHttpServer())
      .put(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'cancelled' })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', bookingId);
        expect(response.body.status).toEqual('cancelled');
      });
  });

  it('/bookings/:id (DELETE)', async () => {
    const bookingResponse = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        userId,
        flightId,
        bookingDate: new Date(),
        status: 'confirmed'
      });

    const bookingId = bookingResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then(() => {
        return request(app.getHttpServer())
          .get(`/bookings/${bookingId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(404);
      });
  });
});
