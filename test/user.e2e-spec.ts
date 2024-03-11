import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  const defaultEmail = 'email@test.com';
  const defaultPassword = 'password';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
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

      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: secondEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .get('/users')
        .set('Cookie', cookies)
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
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .get('/users?email=')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toMatchObject({});
    });

    it('returns user, OK', async () => {
      await request(server)
        .post('/auth/signup')
        .send({ email: `111-${defaultEmail}`, password: defaultPassword })
        .expect(201);

      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .get(`/users?email=${defaultEmail}`)
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toMatchObject({ id: 4, email: defaultEmail });
    });
  });

  describe('GET:/users/:id', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).get('/users/1').expect(403);
    });

    it('id is not a number, throws an error, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .get('/users/sss')
        .set('Cookie', cookies)
        .expect(400);

      expect(response.body.message).toBe('Id must be a positive number');
    });

    it('user is not found, throws an error, NOT_FOUND', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .get('/users/4')
        .set('Cookie', cookies)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('returns user, OK', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .get('/users/3')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toMatchObject({ id: 3, email: defaultEmail });
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
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .patch('/users/sss')
        .set('Cookie', cookies)
        .send({ email: newEmail })
        .expect(400);

      expect(response.body.message).toBe('Id must be a positive number');
    });

    it('user is not found, throws an error, NOT_FOUND', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .patch('/users/4')
        .set('Cookie', cookies)
        .send({ email: newEmail })
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('empty update object, nothing is changed, OK', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      await request(server)
        .patch('/users/3')
        .set('Cookie', cookies)
        .send({})
        .expect(200)
        .expect({});

      const response = await request(server)
        .get('/users/3')
        .set('Cookie', cookies)
        .expect(200);
      expect(response.body).toMatchObject({ id: 3, email: defaultEmail });
    });

    it('updates user email, OK', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      await request(server)
        .patch('/users/1')
        .set('Cookie', cookies)
        .send({ email: newEmail })
        .expect(200)
        .expect({});

      const response = await request(server)
        .get('/users/1')
        .set('Cookie', cookies)
        .expect(200);
      expect(response.body).toMatchObject({ id: 1, email: newEmail });
    });
  });

  describe('DELETE:/users/:id', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).delete('/users/1').expect(403);
    });

    it('id is not a number, throws an error, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .delete('/users/sss')
        .set('Cookie', cookies)
        .expect(400);

      expect(response.body.message).toBe('Id must be a positive number');
    });

    it('user is not found, throws an error, NOT_FOUND', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .delete('/users/4')
        .set('Cookie', cookies)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('removes user, NO_CONTENT', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      await request(server)
        .delete('/users/1')
        .set('Cookie', cookies)
        .expect(204)
        .expect({});

      await request(server).get('/users/1').set('Cookie', cookies).expect(404);
    });
  });
});
