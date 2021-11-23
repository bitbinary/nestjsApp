import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../src/constants/config';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { DatabaseModule } from '../src/database/database.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import {
  CORRECT_LOGIN,
  INCORRECT_LOGIN,
  LOGIN_FAILURE_RESPONSE,
  LOGIN_SUCCESS_RESPONSE,
} from './constants/authentication';

// Login process e2e Testing
describe('Authentication - LOGIN (e2e)', () => {
  let app: INestApplication;
  //   Login process e2e Testing correct login details sample
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        AuthenticationModule,
        DatabaseModule,
      ],
      controllers: [AppController],
      providers: [AppService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  // Test to check if the login API works
  describe('Correct Login - 1 (Failes if Account is locked)', () => {
    it('/login (POST)', async () => {
      request(app.getHttpServer())
        .post('/login')
        .send(CORRECT_LOGIN)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(LOGIN_SUCCESS_RESPONSE);
        });
    });
  });

  // Test to check if the login API works in failure condition
  describe('Incorrect Login - 1', () => {
    it('/login (POST)', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send(INCORRECT_LOGIN)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(LOGIN_FAILURE_RESPONSE);
        });
    });
  });

  // Test to check if the login API works in failure condition and increament lockAttempts
  describe('Incorrect Login - 2', () => {
    it('/login (POST)', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send(INCORRECT_LOGIN)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(LOGIN_FAILURE_RESPONSE);
        });
    });
  });

  // Test to check if the login API works in failure condition and increament lockAttempts and Locks the account
  describe('Incorrect Login - 3 ( Lock the Account if it is not already locked )', () => {
    it('/login (POST)', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send(INCORRECT_LOGIN)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(LOGIN_FAILURE_RESPONSE);
        });
    });
  });

  // Test to check if the login API locks the account after three incorrect attempts
  describe('Correct Login - 2 (Expects Failed Login)', () => {
    it('/login (POST)', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send(CORRECT_LOGIN)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(LOGIN_FAILURE_RESPONSE);
        });
    });
  });
});
