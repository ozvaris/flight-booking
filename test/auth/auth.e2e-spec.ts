import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/user.entity';
import { Repository } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  describe('/auth/signup (POST)', () => {
    it('should signup a user', async () => {
      const signupData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!'
      };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(201);
    });

    it('should fail if email already exists', async () => {
      const signupData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!'
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(201);

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(409, {
          statusCode: 409,
          message: 'This user already exists',
          error: 'Conflict'
        });
    });

    it('should fail if email format is invalid', async () => {
      const signupData = {
        email: 'invalid-email',
        password: 'TestPassword123!'
      };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toEqual(['Invalid email format']);
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a user', async () => {
      const signupData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!'
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(201);

      const loginData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!'
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(201)
        .expect(({ body }) => {
          expect(body.access_token).toBeDefined();
        });
    });

    it('should fail with wrong credentials', async () => {
      const signupData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!'
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(201);

      const loginData = {
        email: 'testuser@example.com',
        password: 'WrongPassword!'
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401, {
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized'
        });
    });
  });
});
