import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    process.env.KEYCLOAK_URL ??= 'http://localhost:8080';
    process.env.KEYCLOAK_REALM ??= 'chess';
    process.env.KEYCLOAK_ISSUER ??= 'http://localhost:8080/realms/chess';
    process.env.KEYCLOAK_API_CLIENT_ID ??= 'chess-api';
    process.env.KEYCLOAK_API_CLIENT_SECRET ??= 'chess-api-secret';
    process.env.KEYCLOAK_ADMIN_CLIENT_ID ??= 'chess-admin';
    process.env.KEYCLOAK_ADMIN_CLIENT_SECRET ??= 'chess-admin-secret';
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
