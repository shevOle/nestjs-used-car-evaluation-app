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

describe('UsersController (e2e)', () => {
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

  describe('GET:/users', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).get('/users').expect(403);
    });

    it('return users list, OK', async () => {
      const secondEmail = `1-${defaultEmail}`;
      await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      await request(server)
        .post('/auth/signup')
        .send({ email: secondEmail, password: defaultPassword })
        .expect(201);

      const response = await request(server)
        .get('/users')
        .set('Cookie', userCookies)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(4);

      const [_, __, user1, user2] = response.body;
      expect(user1).toMatchObject({ email: defaultEmail, id: 3 });
      expect(user2).toMatchObject({ email: secondEmail, id: 4 });
    });
  });

  describe('GET:/users?email=', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).get(`/users?email=${defaultEmail}`).expect(403);
    });

    it('no email passed, returns null, OK', async () => {
      const response = await request(server)
        .get('/users?email=')
        .set('Cookie', userCookies)
        .expect(200);

      expect(response.body).toMatchObject({});
    });

    it('returns user, OK', async () => {
      await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const response = await request(server)
        .get(`/users?email=${defaultEmail}`)
        .set('Cookie', userCookies)
        .expect(200);

      expect(response.body).toMatchObject({ id: 3, email: defaultEmail });
    });
  });

  describe('GET:/users/:id', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).get('/users/1').expect(403);
    });

    it('id is not a number, throws an error, BAD_REQUEST', async () => {
      const response = await request(server)
        .get('/users/sss')
        .set('Cookie', userCookies)
        .expect(400);

      expect(response.body.message).toBe('Id must be a positive number');
    });

    it('user is not found, throws an error, NOT_FOUND', async () => {
      const response = await request(server)
        .get('/users/4')
        .set('Cookie', userCookies)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('returns user, OK', async () => {
      const response = await request(server)
        .get('/users/2')
        .set('Cookie', userCookies)
        .expect(200);

      expect(response.body).toMatchObject({ id: 2, email: DEFAULT_USER_EMAIL });
    });
  });

  describe('PATCH:/users/:id', () => {
    const newEmail = 'newemail@test.com';
    it('not logged in, FORBIDDEN', async () => {
      await request(server)
        .patch('/users/1')
        .send({ email: newEmail })
        .expect(403);
    });

    it('id is not a number, throws an error, BAD_REQUEST', async () => {
      const response = await request(server)
        .patch('/users/sss')
        .set('Cookie', userCookies)
        .send({ email: newEmail })
        .expect(400);

      expect(response.body.message).toBe('Id must be a positive number');
    });

    it('user is not found, throws an error, NOT_FOUND', async () => {
      const response = await request(server)
        .patch('/users/7')
        .set('Cookie', userCookies)
        .send({ email: newEmail })
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('empty update object, nothing is changed, OK', async () => {
      await request(server)
        .patch('/users/2')
        .set('Cookie', userCookies)
        .send({})
        .expect(200)
        .expect({});

      const response = await request(server)
        .get('/users/2')
        .set('Cookie', userCookies)
        .expect(200);

      expect(response.body).toMatchObject({ id: 2, email: DEFAULT_USER_EMAIL });
    });

    it('updates user email, OK', async () => {
      await request(server)
        .patch('/users/2')
        .set('Cookie', userCookies)
        .send({ email: newEmail })
        .expect(200)
        .expect({});

      const response = await request(server)
        .get('/users/2')
        .set('Cookie', userCookies)
        .expect(200);
      expect(response.body).toMatchObject({ id: 2, email: newEmail });
    });
  });

  describe('DELETE:/users/:id', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).delete('/users/1').expect(403);
    });

    it('id is not a number, throws an error, BAD_REQUEST', async () => {
      const response = await request(server)
        .delete('/users/sss')
        .set('Cookie', userCookies)
        .expect(400);

      expect(response.body.message).toBe('Id must be a positive number');
    });

    it('user is not found, throws an error, NOT_FOUND', async () => {
      const response = await request(server)
        .delete('/users/4')
        .set('Cookie', userCookies)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('removes user, NO_CONTENT', async () => {
      await request(server)
        .delete('/users/1')
        .set('Cookie', userCookies)
        .expect(204)
        .expect({});

      await request(server)
        .get('/users/1')
        .set('Cookie', userCookies)
        .expect(404);
    });
  });
});
