import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Flight } from '../../src/flight/flight.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/user/user.entity';

describe('FlightController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let flightRepository: Repository<Flight>;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    flightRepository = moduleFixture.get<Repository<Flight>>(getRepositoryToken(Flight));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    const signupData = {
      email: 'testuser@example.com',
      password: 'TestPassword123!',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData)
      .expect(201);

    userToken = response.body.accessToken;

  });

  beforeEach(async () => {
    
  });

  afterAll(async () => {

    await flightRepository.createQueryBuilder().delete().from(Flight).execute();
    await userRepository.createQueryBuilder().delete().from(User).execute();
    await app.close();
    
  });

  it('/flights (POST)', () => {
    return request(app.getHttpServer())
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
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.airline).toEqual('Test Airline');
      });
  });

  it('/flights (GET)', () => {
    return request(app.getHttpServer())
      .get('/flights')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });

  it('/flights/:id (GET)', () => {
    return request(app.getHttpServer())
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
      .then((res) => {
        const flightId = res.body.id;
        return request(app.getHttpServer())
          .get(`/flights/${flightId}`)
          .expect(200)
          .then((response) => {
            expect(response.body).toHaveProperty('id', flightId);
          });
      });
  });

  it('/flights/:id (PUT)', () => {
    return request(app.getHttpServer())
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
      .then((res) => {
        const flightId = res.body.id;
        return request(app.getHttpServer())
          .put(`/flights/${flightId}`)
          .send({ price: 200 })
          .expect(200)
          .then((response) => {
            expect(response.body).toHaveProperty('id', flightId);
            expect(Number(response.body.price)).toEqual(200);
          });
      });
  });

  it('/flights/:id (DELETE)', () => {
    return request(app.getHttpServer())
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
      .then((res) => {
        const flightId = res.body.id;
        return request(app.getHttpServer())
          .delete(`/flights/${flightId}`)
          .expect(200)
          .then(() => {
            return request(app.getHttpServer())
              .get(`/flights/${flightId}`)
              .expect(404);
          });
      });
  });
});
