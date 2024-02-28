import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from '../entities/report.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  create(currentUser: User, reportData: CreateReportDto) {
    const currentYear = new Date().getFullYear();
    if (reportData.year > currentYear)
      throw new BadRequestException('You can not sell a car from the future!');

    const report = this.reportRepository.create(reportData);
    report.user = currentUser;
    return this.reportRepository.save(report);
  }
}
