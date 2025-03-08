import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    const responseBody = {
      statusCode: 200,
      success: true,
      data: { message: 'Hello World!' },
    };

    return request(app.getHttpServer()).get('/').expect(200).expect(responseBody);
  });

  it('/health (GET)', () => {
    const responseBody = {
      statusCode: 200,
      success: true,
      data: 'OK',
    };

    return request(app.getHttpServer()).get('/health').expect(200).expect(responseBody);
  });
});
