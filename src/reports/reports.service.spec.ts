import { BadRequestException, NotFoundException } from '@nestjs/common';
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
      find: jest.fn(),
      findOne: jest.fn((id) => Promise.resolve({ ...defaultReport, id })),
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

  describe('create many reports (development utility)', () => {
    it('creates reports, OK', async () => {
      repository.createQueryBuilder = jest.fn();

      const reportsData = Array(5).fill(defaultReport);
      await service.createMany(defaultUser, reportsData);

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
    });
  });

  describe('find reports by user id', () => {
    it('Id  is not a number, BAD_REQUEST', async () => {
      const expectedException = new BadRequestException(
        'Id is required and should be a number',
      );

      await expect(service.findByUserId('s' as any)).rejects.toThrow(
        expectedException,
      );
    });

    it('finds reports by user id, OK', async () => {
      const id = 5;
      await service.findByUserId(id);

      expect(fakeRepository.find).toHaveBeenCalledWith({
        where: { user: { id } },
      });
    });
  });

  describe('find one by id', () => {
    it('Id  is not a number, BAD_REQUEST', async () => {
      const expectedException = new BadRequestException(
        'Id is required and should be a number',
      );

      await expect(service.findByUserId('s' as any)).rejects.toThrow(
        expectedException,
      );
    });

    it('report  not found, NOT_FOUND', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(null);

      const expectedException = new NotFoundException('Report not found');
      await expect(service.findById(2)).rejects.toThrow(expectedException);
    });

    it('finds a report, OK', async () => {
      const id = 5;
      await service.findById(id);

      expect(fakeRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
