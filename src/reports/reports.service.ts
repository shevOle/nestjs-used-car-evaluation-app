import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportRequestDto } from './dtos/create-report.request.dto';
import { GetEstimateRequestDto } from './dtos/get-estimate.request.dto';
import { Report } from '../db/entities/report.entity';
import { User } from '../db/entities/user.entity';

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

  async getEstimate({
    lat,
    lng,
    make,
    mileage,
    model,
    year,
  }: GetEstimateRequestDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .orderBy('ABS(mileage - :mileage)', 'ASC')
      .setParameters({ mileage })
      .limit(5)
      .getRawOne();
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
    id: number,
    currentser: User,
    appproved: boolean,
  ): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new BadRequestException('Report not found');

    report.updatedByUserId = currentser.id;
    report.status = appproved ? 'approved' : 'rejected';
    return this.reportRepository.save(report);
  }
}
