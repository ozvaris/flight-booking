import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UserService } from '../../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/user.entity';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let userToken: string;
  let userId: number;
  let anotherUserToken: string;
  let anotherUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    
    // İlk kullanıcı oluşturma ve token alma
    const signupData1 = {
      email: `testuser1@example.com`,
      password: 'TestPassword123!',
    };

    const response1 = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData1)
      .expect(201);

    userToken = response1.body.accessToken;
    userId = response1.body.user.id;

    const signupData2 = {
      email: `testuser2@example.com`,
      password: 'TestPassword123!',
    };

    const response2 = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData2)
      .expect(201);

    anotherUserToken = response2.body.accessToken;
    anotherUserId = response2.body.user.id;

  });

  afterAll(async () => {
    await userRepository.createQueryBuilder().delete().from(User).execute();
    await app.close();
  });

  beforeEach(async () => {
    
  });

  it('/user/:id (GET) - should get user profile', async () => {
    await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });

  it('/user/:id (GET) - should return 404 for non-existing user on get', async () => {
    await request(app.getHttpServer())
      .get('/user/9999')// Not existing user ID
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });

  it('/user/:id (PATCH) - should update user profile', async () => {
    const expectedResponse = { id: userId, profilePicture: 'new-picture.jpg' };
    const filePath = 'test/test-pictures/horse.png';
    const fileExtension = '.png';

    const response = await request(app.getHttpServer())
      .patch(`/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', filePath)
      .expect(200)

      const { profilePicture  } = response.body;
      expect(profilePicture ).toContain(fileExtension);
      
      const fileName = profilePicture.replace('/uploads/test-pictures/', '');
      expect(fileName).toMatch(/file-\d+-\d+\.\w+/);
      
      expect(response.body).toEqual(
        expect.objectContaining({ id: userId }),
      );
  });

  it('/user/:id (PATCH) - should return 404 for non-existing user', async () => {
    const updateProfileDto = { profilePicture: 'new-picture.jpg' };

    await request(app.getHttpServer())
      .patch('/user/9999') // Not existing user ID
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateProfileDto)
      .expect(403);
  });

  it('/user/:id (PATCH) - should return 403 for unauthorized user', async () => {
    const updateProfileDto = { profilePicture: 'new-picture.jpg' };

    await request(app.getHttpServer())
      .patch(`/user/${userId}`)
      .set('Authorization', `Bearer ${anotherUserToken}`) // wrong token
      .send(updateProfileDto)
      .expect(403);
  });

  
});