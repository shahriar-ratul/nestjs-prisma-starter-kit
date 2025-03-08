import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('AuthController (e2e)', () => {
  const authUrl = process.env.BASE_URL + '/api/auth';

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  describe('POST /api/auth/login', () => {
    it('should return 200', () => {
      const requestBody = {
        username: 'super_admin',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send(requestBody)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            statusCode: 200,
            success: true,
            data: {
              accessToken: expect.any(String),
              refreshToken: expect.any(String),
              expiresIn: expect.any(Number),
            },
          });
        });
    });

    it('should return 401', () => {
      const requestBody = {
        username: 'test@test.com',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(requestBody)
        .expect((res) => {
          expect(res.body).toMatchObject({
            statusCode: 422,
            success: false,
            message: 'Invalid credentials',
          });
        });
    });

    it('should return 422', () => {
      const requestBody = {
        username: 'super_admin',
        password: 'pass',
      };
      return request(app.getHttpServer()).post('/api/auth/login').send(requestBody).expect(422);
    });

    it('should return 422', () => {
      const requestBody = {
        username: '',
        password: '',
      };
      return request(app.getHttpServer()).post('/api/auth/login').send(requestBody).expect(422);
    });
  });
});
