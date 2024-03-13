import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { pick } from 'lodash';
import { AppModule } from '../src/app.module';
import {
  getRandomReportData,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_PASSWORD,
} from '../src/common/constants/test.constants';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let userCookies: string[];
  let adminCookies: string[];

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

    const adminLoginResponse = await request(server)
      .post('/auth/login')
      .send({ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD })
      .expect(200);

    userCookies = userLoginResponse.get('Set-Cookie');
    adminCookies = adminLoginResponse.get('Set-Cookie');
  });

  describe('POST:/reports', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).post('/reports').expect(403);
    });

    it('got request w/o model, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      delete report.model;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('Model is obligatory');
    });

    it('got request w/o maker, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      delete report.make;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('Maker is obligatory');
    });

    it('got request with mileage greater than 1000000, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.mileage = 1000000000;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Mileage should be a positive number up to 1000000',
      );
    });

    it('got request with mileage less than 0, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.mileage = -12;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Mileage should be a positive number up to 1000000',
      );
    });

    it('got request w/o mileage, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      delete report.mileage;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe('Mileage is obligatory');
    });

    it('got request with invalid mileage value, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.mileage = 'aksijf' as any;

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);
    });

    it('got request with price less than 0, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.price = -12;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Price should be a positive number up to 1000000',
      );
    });

    it('got request with price greater than 1000000, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.price = 1000001;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Price should be a positive number up to 1000000',
      );
    });

    it('got request w/o price, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      delete report.price;

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);
    });

    it('got request with invalid price value, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.price = 'aksijf' as any;

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);
    });

    it('got year that is greater that current year, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.year = 2030;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message).toBe(
        'You can not sell a car from the future!',
      );
    });

    it('got request with year less than 1990, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.year = 1899;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Year value must be from 1990 to 2030',
      );
    });

    it('got request with year greater than 2030, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.year = 2101;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Year value must be from 1990 to 2030',
      );
    });

    it('got request w/o year, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      delete report.year;

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);
    });

    it('got request with invalid year value, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.year = 'aksijf' as any;

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);
    });

    it('got request with latitude greater than 90, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.lat = 91;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Latitude must be a number between -90 and 90',
      );
    });

    it('got request with latitude less than -90, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.lat = -91;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Latitude must be a number between -90 and 90',
      );
    });

    it('got request with invalid lat value, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.lat = 'ksj' as any;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Latitude must be a number between -90 and 90',
      );
    });

    it('got request w/o latitude, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      delete report.lat;

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);
    });

    it('got request with longitude greater than 180, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.lng = 181;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Longitude must be a number between -180 and 180',
      );
    });

    it('got request with longitude less than -180, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.lng = -181;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Longitude must be a number between -180 and 180',
      );
    });

    it('got request with invalid lng value, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      report.lng = 'ksj' as any;

      const response = await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Longitude must be a number between -180 and 180',
      );
    });

    it('got request w/o longitude, BAD_REQUEST', async () => {
      const report = getRandomReportData();
      delete report.lng;

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(400);
    });

    it('creates a report, CREATED', async () => {
      const report = getRandomReportData();

      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(201);

      const createdReport = await request(server)
        .get('/reports/own')
        .set('Cookie', userCookies)
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
      const response = await request(server)
        .get('/reports/own')
        .set('Cookie', userCookies)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });

    it('get all own reports, OK', async () => {
      await Promise.all([
        request(server)
          .post('/reports')
          .set('Cookie', userCookies)
          .send(getRandomReportData()),
        request(server)
          .post('/reports')
          .set('Cookie', userCookies)
          .send(getRandomReportData()),
      ]);

      const response = await request(server)
        .get('/reports/own')
        .set('Cookie', userCookies)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET:/reports/:id', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).get('/reports/3').expect(403);
    });

    it('id is not valid, BAD_REQUEST', async () => {
      const response = await request(server)
        .get('/reports/sss')
        .set('Cookie', userCookies)
        .expect(400);

      expect(response.body.message).toBe('Id is required');
    });

    it('there is no report with provided id, BAD_REQUEST', async () => {
      const response = await request(server)
        .get('/reports/1')
        .set('Cookie', userCookies)
        .expect(404);

      expect(response.body.message).toBe('Report not found');
    });

    it('returns a report, OK', async () => {
      const report = getRandomReportData();
      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(report)
        .expect(201);

      const response = await request(server)
        .get('/reports/1')
        .set('Cookie', userCookies)
        .expect(200);

      expect(pick(response.body, Object.keys(report))).toMatchObject(report);
    });
  });

  describe('PATCH:/reports/:id', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).patch('/reports/1').expect(403);
    });

    it('logged in as a regular user, FORBIDDEN', async () => {
      await request(server)
        .patch('/reports/1')
        .set('Cookie', userCookies)
        .send({ approved: true })
        .expect(403);
    });

    it('id is not valid, BAD_REQUEST', async () => {
      const response = await request(server)
        .patch('/reports/sss')
        .set('Cookie', adminCookies)
        .send({ approved: true })
        .expect(400);

      expect(response.body.message).toBe('Id is required');
    });

    it('body does not containe approve property, BAD_REQUEST', async () => {
      const response = await request(server)
        .patch('/reports/1')
        .set('Cookie', adminCookies)
        .send({ param: 'value' })
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Approve property should be a boolean',
      );
    });

    it('approve property in body is not valid, BAD_REQUEST', async () => {
      const response = await request(server)
        .patch('/reports/1')
        .set('Cookie', adminCookies)
        .send({ approve: {} })
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Approve property should be a boolean',
      );
    });

    it('there is no report with provided id, NOT_FOUND', async () => {
      const response = await request(server)
        .patch('/reports/1')
        .set('Cookie', adminCookies)
        .send({ approved: true })
        .expect(404);

      expect(response.body.message).toBe('Report not found');
    });

    it('approve the report, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(reportData)
        .expect(201);

      await request(server)
        .patch('/reports/1')
        .set('Cookie', adminCookies)
        .send({ approved: true })
        .expect(200);

      const responseWithReport = await request(server)
        .get('/reports/1')
        .set('Cookie', userCookies)
        .expect(200);

      expect(responseWithReport.body.status).toBe('approved');
    });

    it('reject the report, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      await request(server)
        .post('/reports')
        .set('Cookie', userCookies)
        .send(reportData)
        .expect(201);

      await request(server)
        .patch('/reports/1')
        .set('Cookie', adminCookies)
        .send({ approved: false })
        .expect(200);

      const responseWithReport = await request(server)
        .get('/reports/1')
        .set('Cookie', userCookies)
        .expect(200);

      expect(responseWithReport.body.status).toBe('rejected');
    });
  });

  describe('GET:/reports/estimate', () => {
    it('not logged in, FORBIDDEN', async () => {
      await request(server).get('/reports/estimate').expect(403);
    });

    it('model is not provided, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      delete reportData.model;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Model is obligatory');
    });

    it('maker is not provided, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      delete reportData.make;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Maker is obligatory');
    });

    it('year is not provided, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      delete reportData.year;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Year is obligatory');
    });

    it('mileage is not provided, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      delete reportData.mileage;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Mileage is obligatory');
    });

    it('latitude is not provided, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      delete reportData.lat;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Latitude is obligatory');
    });

    it('longitude is not provided, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      delete reportData.lng;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Longitude is obligatory');
    });

    it('couple of propertiies are not provided, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();

      delete reportData.lng;
      delete reportData.lat;
      delete reportData.mileage;

      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message).toContain('Longitude is obligatory');
      expect(response.body.message).toContain('Latitude is obligatory');
      expect(response.body.message).toContain('Mileage is obligatory');
    });

    it('maker is not valid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.make = [1, 2, 3] as any;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Maker must be a string');
    });

    it('model is not valid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.model = [1, 2, 3] as any;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe('Model must be a string');
    });

    it('mileage is not valid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.mileage = 'kasjsf' as any;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Mileage should be a positive number up to 1000000',
      );
    });

    it('year is not valid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.year = 'kasjsf' as any;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Year value must be from 1990 to 2030',
      );
    });

    it('latitude is not valid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.lat = 'kasjsf' as any;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Latitude must be a number between -90 and 90',
      );
    });

    it('longitude is not valid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.lng = 'kasjsf' as any;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Longitude must be a number between -180 and 180',
      );
    });

    it('couple of properties are not valid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.lng = 'kasjsf' as any;
      reportData.mileage = 'kasjsf' as any;
      reportData.model = [1, 2, 3] as any;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message).toContain(
        'Longitude must be a number between -180 and 180',
      );
      expect(response.body.message).toContain(
        'Mileage should be a positive number up to 1000000',
      );
      expect(response.body.message).toContain('Model must be a string');
    });

    it('year value is off grid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.year = 2043;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Year value must be from 1990 to 2030',
      );
    });

    it('mileage value is off grid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.mileage = -23;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Mileage should be a positive number up to 1000000',
      );
    });

    it('latitude value is off grid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.lat = -120;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Latitude must be a number between -90 and 90',
      );
    });

    it('longitude value is off grid, BAD_REQUEST', async () => {
      const reportData = getRandomReportData();
      reportData.lng = 200;
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(400);

      expect(response.body.message[0]).toBe(
        'Longitude must be a number between -180 and 180',
      );
    });

    it('no reports are found, OK', async () => {
      const reportData = getRandomReportData();
      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query(reportData)
        .expect(200);

      expect(response.body.price).toBeNull();
    });

    it('returns estimate price, OK', async () => {
      const reportData1 = {
        make: 'toyota',
        model: 'corolla',
        year: 1995,
        price: 2000,
        mileage: 500000,
        lat: 5,
        lng: 36,
      };

      const reportData2 = {
        make: 'toyota',
        model: 'corolla',
        year: 1998,
        price: 5000,
        mileage: 239000,
        lat: 12,
        lng: 28,
      };

      const reportData3 = {
        make: 'toyota',
        model: 'corolla',
        year: 2003, // will not be included in results
        price: 7000,
        mileage: 120000,
        lat: 10,
        lng: 30,
      };

      await request(server)
        .post('/reports/man')
        .set('Cookie', adminCookies)
        .send([reportData1, reportData2, reportData3])
        .expect(201);

      const response = await request(server)
        .get('/reports/estimate')
        .set('Cookie', userCookies)
        .query({
          make: 'toyota',
          model: 'corolla',
          year: 1996,
          mileage: 300000,
          lat: 9,
          lng: 31,
        })
        .expect(200);

      expect(response.body.price).toBe(3500);
    });
  });
});
