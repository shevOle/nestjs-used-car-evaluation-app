import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { omitBy, isEmpty } from 'lodash';
import { CreateReportRequestDto } from './dtos/create-report.request.dto';
import { GetEstimateRequestDto } from './dtos/get-estimate.request.dto';
import { Report, ReportStatuses } from '../db/entities/report.entity';
import { User } from '../db/entities/user.entity';

interface IPaginationOptions {
  take?: number;
  skip?: number;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  // development utility
  async createMany(currentUser: User, reportsData: CreateReportRequestDto[]) {
    const reports = reportsData.map((report) => ({
      ...report,
      user: currentUser,
    }));
    return this.reportRepository
      .createQueryBuilder()
      .insert()
      .into(Report)
      .values(reports)
      .execute();
  }

  async findByUserId(userId: number): Promise<Report[]> {
    const id = Number(userId);
    if (!id)
      throw new BadRequestException('Id is required and should be a number');

    return this.reportRepository.find({ where: { user: { id } } });
  }

  async findById(_id: number): Promise<Report> {
    const id = Number(_id);
    if (!id) throw new BadRequestException('Id is required');

    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    return report;
  }

  async getReports(options: Partial<Report>): Promise<Report[]>;
  async getReports(
    options: Partial<Report>,
    paginationOptions: IPaginationOptions,
  ): Promise<{ results: Report[]; count: number }>;
  async getReports(
    options: Partial<Report>,
    paginationOptions?: IPaginationOptions,
  ): Promise<Report[] | { results: Report[]; count: number }> {
    let results: Report[];
    let count: number;
    const filters: FindManyOptions<Report> = { where: options };
    const query: FindManyOptions<Report> = { ...filters, ...paginationOptions };

    results = await this.reportRepository.find(query);

    if (paginationOptions) {
      count = await this.reportRepository.count(filters);
      return { results, count };
    }

    return results;
  }

  async getEstimate(
    params: GetEstimateRequestDto,
  ): Promise<{ reports: Report[]; averagePrice: number }> {
    try {
      const { make, model } = params || {};
      const mileage = Number(params?.mileage);
      const year = Number(params?.year);
      const lat = Number(params?.lat);
      const lng = Number(params?.lng);

      if (
        [make, model].some((v) => !v) ||
        [mileage, year, lat, lng].some((v) => Number.isNaN(v))
      ) {
        throw new BadRequestException(
          'You have to provide make, model, mileage, year and your coordinates to get a precise report',
        );
      }

      const { price: averagePrice } = await this.reportRepository
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .orderBy('ABS(mileage - :mileage)', 'ASC')
        .setParameters({ mileage })
        .getRawOne();

      const reports = await this.reportRepository
        .createQueryBuilder()
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .orderBy('ABS(mileage - :mileage)', 'ASC')
        .setParameters({ mileage })
        .getMany();

      return { reports, averagePrice };
    } catch (err) {
      console.error('Error during getting report estimate', err);
      console.log('Query params: ', params);
    }
  }

  async create(
    currentUser: User,
    reportData: CreateReportRequestDto,
  ): Promise<Report> {
    const currentYear = new Date().getFullYear();
    if (reportData.year > currentYear)
      throw new BadRequestException('You can not sell a car from the future!');

    const report = this.reportRepository.create(reportData);
    report.user = currentUser;
    return this.reportRepository.save(report);
  }

  async checkReport(
    _id: number,
    currentser: User,
    status: ReportStatuses,
  ): Promise<Report> {
    const id = Number(_id);
    if (!id) throw new BadRequestException('Id is required');

    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    report.updatedByUserId = currentser.id;
    report.status = status;
    return this.reportRepository.save(report);
  }
}
