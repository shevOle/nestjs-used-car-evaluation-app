import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportRequestDto } from './dtos/create-report.request.dto';
import { Report } from '../entities/report.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  create(currentUser: User, reportData: CreateReportRequestDto) {
    const currentYear = new Date().getFullYear();
    if (reportData.year > currentYear)
      throw new BadRequestException('You can not sell a car from the future!');

    const report = this.reportRepository.create(reportData);
    report.user = currentUser;
    return this.reportRepository.save(report);
  }

  async checkReport(id: number, currentser: User, appproved: boolean) {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new BadRequestException('Report not found');

    report.updatedByUserId = currentser.id;
    report.status = appproved ? 'approved' : 'rejected';
    return this.reportRepository.save(report);
  }
}
