import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  async createReport(
    @CurrentUser() currentUser: User,
    @Body() body: CreateReportDto,
    @Res() res: IResponse,
  ) {
    await this.reportService.create(currentUser, body);
    return res.sendStatus(201);
  }
}
