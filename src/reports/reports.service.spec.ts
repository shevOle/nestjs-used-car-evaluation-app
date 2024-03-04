import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Report } from '../db/entities/report.entity';
import { Repository } from 'typeorm';

const defaultReport = {
  make: 'toyota',
  model: 'corolla',
  year: 1980,
  lat: 1,
  lng: 2,
  mileage: 10000,
  price: 1000,
};
const defaultUser = {
  id: 1,
  email: 'email@test.com',
  password: 'pass',
  reports: [],
  isAdmin: true,
};

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: Repository<Report>;
  let fakeRepository;

  beforeEach(async () => {
    fakeRepository = {
      create: jest.fn((report) => ({ id: 1, ...report })),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: fakeRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repository = module.get(getRepositoryToken(Report));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create report', () => {
    it('provided year is in future, BAD_REQUEST', async () => {
      const reportData = {
        ...defaultReport,
        year: new Date().getFullYear() + 1,
      };
      const expectedException = new BadRequestException(
        'You can not sell a car from the future!',
      );
      await expect(service.create(defaultUser, reportData)).rejects.toThrow(
        expectedException,
      );
    });

    it('creates a report, OK', async () => {
      await service.create(defaultUser, defaultReport);

      expect(fakeRepository.create).toHaveBeenCalledWith(defaultReport);

      expect(fakeRepository.save).toHaveBeenCalledWith({
        id: 1,
        ...defaultReport,
        user: defaultUser,
      });
    });
  });

  describe('check report', () => {
    it('there is no report found, BAD_REQUEST', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(null);
      const expectedException = new BadRequestException('Report not found');

      await expect(service.checkReport(12, defaultUser, true)).rejects.toThrow(
        expectedException,
      );
    });

    it('successfully approves report, OK', async () => {
      const id = 2;
      const report = { id, ...defaultReport, user: defaultUser };
      repository.findOne = jest.fn().mockResolvedValueOnce(report);

      await service.checkReport(id, defaultUser, true);
      expect(fakeRepository.save).toHaveBeenCalledWith({
        ...report,
        updatedByUserId: defaultUser.id,
        status: 'approved',
      });
    });

    it('successfully rejects report, OK', async () => {
      const id = 3;
      const report = { id, ...defaultReport, user: defaultUser };
      repository.findOne = jest.fn().mockResolvedValueOnce(report);

      await service.checkReport(id, defaultUser, false);
      expect(fakeRepository.save).toHaveBeenCalledWith({
        ...report,
        updatedByUserId: defaultUser.id,
        status: 'rejected',
      });
    });
  });
});
