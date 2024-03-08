import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { pick } from 'lodash';
import { AppModule } from '../src/app.module';
import {
  defaultEmail,
  defaultPassword,
  getRandomReportData,
} from '../src/common/constants/test.constants';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST:/reports', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).post('/reports').expect(403);
    });

    it('got request w/o model, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      delete report.model;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('model must be a string');
    });

    it('got request w/o maker, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      delete report.make;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('make must be a string');
    });

    it('got request with mileage greater than 1000000, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.mileage = 1000000000;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'mileage must not be greater than 1000000',
      );
    });

    it('got request with mileage less than 0, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.mileage = -12;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('mileage must not be less than 0');
    });

    it('got request w/o mileage, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      delete report.mileage;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('got request with invalid mileage value, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.mileage = 'aksijf' as any;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('got request with price less than 0, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.price = -12;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('price must not be less than 0');
    });

    it('got request with price greater than 1000000, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.price = 1000001;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'price must not be greater than 1000000',
      );
    });

    it('got request w/o price, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      delete report.price;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('got request with invalid price value, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.price = 'aksijf' as any;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('got year that is greater that current year, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.year = 2030;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message).toBe(
        'You can not sell a car from the future!',
      );
    });

    it('got request with year less than 1900, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.year = 1899;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('year must not be less than 1900');
    });

    it('got request with year greater than 2100, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.year = 2101;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'year must not be greater than 2100',
      );
    });

    it('got request w/o year, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      delete report.year;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('got request with invalid year value, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.year = 'aksijf' as any;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('got request with latitude greater than 90, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.lat = 91;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'lat must be a latitude string or number',
      );
    });

    it('got request with latitude less than -90, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.lat = -91;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'lat must be a latitude string or number',
      );
    });

    it('got request with invalid lat value, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.lat = 'ksj' as any;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'lat must be a latitude string or number',
      );
    });

    it('got request w/o latitude, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      delete report.lat;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('got request with longitude greater than 180, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.lng = 181;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'lng must be a longitude string or number',
      );
    });

    it('got request with longitude less than -180, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.lng = -181;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'lng must be a longitude string or number',
      );
    });

    it('got request with invalid lng value, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      report.lng = 'ksj' as any;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'lng must be a longitude string or number',
      );
    });

    it('got request w/o longitude, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();
      delete report.lng;

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(400);
    });

    it('creates a report, CREATED', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const report = getRandomReportData();

      await request(server)
        .post('/reports')
        .set('Cookie', cookies)
        .send(report)
        .expect(201);

      const createdReport = await request(server)
        .get('/reports/own')
        .set('Cookie', cookies)
        .expect(200);

      expect(createdReport.body).toBeInstanceOf(Array);
      expect(createdReport.body).toHaveLength(1);

      expect(pick(createdReport.body[0], Object.keys(report))).toMatchObject(
        report,
      );
    });
  });

  describe('GET:/reports/own', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).get('/reports/own').expect(403);
    });

    it('no own reports, get empty array, BAD_REQUEST', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');
      const response = await request(server)
        .get('/reports/own')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });

    it('get all own reports, OK', async () => {
      const signupResponse = await request(server)
        .post('/auth/signup')
        .send({ email: defaultEmail, password: defaultPassword })
        .expect(201);

      const cookies = signupResponse.get('Set-Cookie');

      await Promise.all([
        request(server)
          .post('/reports')
          .set('Cookie', cookies)
          .send(getRandomReportData()),
        request(server)
          .post('/reports')
          .set('Cookie', cookies)
          .send(getRandomReportData()),
      ]);

      const response = await request(server)
        .get('/reports/own')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
    });
  });
});
