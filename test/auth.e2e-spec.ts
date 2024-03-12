import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  defaultEmail,
  defaultPassword,
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_PASSWORD,
} from '../src/common/constants/test.constants';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let userCookies: string[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    const userLoginResponse = await request(server)
      .post('/auth/login')
      .send({ email: DEFAULT_USER_EMAIL, password: DEFAULT_USER_PASSWORD })
      .expect(200);

    userCookies = userLoginResponse.get('Set-Cookie');
  });

  describe('POST:/auth/signup', () => {
    it('creates a user and saves a session, CREATED', async () => {
      const response = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const session = response.get('Set-Cookie');
      expect(session).toBeDefined();
    });

    it('email is already in use, BAD_REQUEST', async () => {
      const response = await request(server)
        .post('/auth/signup')
        .send({ email: DEFAULT_USER_EMAIL, password: defaultPassword })
        .expect(400);

      expect(response.body.message).toBe('This email is already in use');
    });
  });

  describe('GET:/auth/whoami', () => {
    it('not logged in, FORBIDDEN', async () => {
      return request(server).get('/auth/whoami').expect(403);
    });

    it('logged in, returns user, OK', async () => {
      const response = await request(server)
        .get('/auth/whoami')
        .set('Cookie', userCookies)
        .expect(200);

      const user = response.body;
      expect(user).toBeDefined();
      expect(user).toMatchObject({ id: 2, email: DEFAULT_USER_EMAIL });
    });
  });

  describe('POST:/auth/login', () => {
    it('email is incorrect, BAD_REQUEST', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'ssss@ssssss.com', password: defaultPassword })
        .expect(400);

      const cookies = response.get('Set-Cookie');
      expect(cookies).not.toBeDefined();
      expect(response.body.message).toBe('Username or password is incorrect');
    });

    it('password is incorrect, BAD_REQUEST', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: defaultEmail, password: 'sss' })
        .expect(400);

      const cookies = response.get('Set-Cookie');
      expect(cookies).not.toBeDefined();
      expect(response.body.message).toBe('Username or password is incorrect');
    });

    it('saves user session, OK', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: DEFAULT_USER_EMAIL, password: DEFAULT_USER_PASSWORD })
        .expect(200);

      const cookies = response.get('Set-Cookie');
      expect(cookies).toBeDefined();
    });
  });

  describe('POST:/auth/logout', () => {
    it('not logged in, FORBIDDEN', async () => {
      return request(server).post('/auth/logout').expect(403);
    });

    it('logged in, removes user session, OK', async () => {
      const response = await request(server)
        .post('/auth/logout')
        .set('Cookie', userCookies)
        .expect(200);

      const cookies = response.get('Set-Cookie');
      expect(cookies).toBeDefined();

      await request(server).get('/auth/whoami').expect(403);
    });
  });
});
