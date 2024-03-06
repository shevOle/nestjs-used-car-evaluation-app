import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { defaultReport, defaultUser } from '../common/constants/test.constants';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportService: Partial<ReportsService>;
  const fakeResponseObj: any = {
    sendStatus: jest.fn(),
  };

  beforeEach(async () => {
    fakeReportService = {
      getEstimate: jest.fn(),
      createMany: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      checkReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: fakeReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get price estimate', () => {
    it('passes query down, OK', async () => {
      await controller.priceEstimate(defaultReport);

      expect(fakeReportService.getEstimate).toHaveBeenCalledWith(defaultReport);
    });
  });

  describe('generate reports', () => {
    it('passes request down, OK', async () => {
      const reports = Array(3).fill(defaultReport);
      await controller.createMany(defaultUser, reports, fakeResponseObj);

      expect(fakeReportService.createMany).toHaveBeenCalledWith(
        defaultUser,
        reports,
      );
      expect(fakeResponseObj.sendStatus).toHaveBeenCalledWith(201);
    });
  });

  describe('get own report', () => {
    it('passes request down, OK', async () => {
      await controller.getMyReports(defaultUser);

      expect(fakeReportService.findByUserId).toHaveBeenCalledWith(
        defaultUser.id,
      );
    });
  });

  describe('get report by id', () => {
    it('passes request down, OK', async () => {
      const id = 3;
      await controller.getOne(id);

      expect(fakeReportService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('creates one report', () => {
    it('passes request down, OK', async () => {
      await controller.createReport(
        defaultUser,
        defaultReport,
        fakeResponseObj,
      );

      expect(fakeReportService.create).toHaveBeenCalledWith(
        defaultUser,
        defaultReport,
      );
      expect(fakeResponseObj.sendStatus).toHaveBeenCalledWith(201);
    });
  });

  describe('marks report checkked', () => {
    it('passes request down, OK', async () => {
      const body = { approved: false };
      const id = 4;
      await controller.checkReport(defaultUser, id, body, fakeResponseObj);

      expect(fakeReportService.checkReport).toHaveBeenCalledWith(
        id,
        defaultUser,
        body.approved,
      );
      expect(fakeResponseObj.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});
