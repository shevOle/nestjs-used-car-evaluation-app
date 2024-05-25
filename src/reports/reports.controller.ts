import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as IResponse } from 'express';
import { ReportsService } from './reports.service';
import { CreateReportRequestDto } from './dtos/create-report.request.dto';
import { CheckReportRquestDto } from './dtos/check-report.request.dto';
import { GetEstimateRequestDto } from './dtos/get-estimate.request.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../db/entities/user.entity';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('Reports')
@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get()
  getAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('limit') limit: number,
  ) {
    return this.reportService.getAll({ page, perPage, limit });
  }

  @Get('/estimate')
  priceEstimate(@Query() query: GetEstimateRequestDto) {
    return this.reportService.getEstimate(query);
  }

  @UseGuards(AdminAuthGuard)
  @Post('/many')
  async createMany(
    @CurrentUser() currentUser: User,
    @Body() body: CreateReportRequestDto[],
    @Res() res: IResponse,
  ) {
    await this.reportService.createMany(currentUser, body);
    return res.sendStatus(201);
  }

  @Get('/own')
  getMyReports(@CurrentUser() user: User) {
    return this.reportService.findByUserId(user.id);
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.reportService.findById(id);
  }

  @Post()
  async createReport(
    @CurrentUser() currentUser: User,
    @Body() body: CreateReportRequestDto,
    @Res() res: IResponse,
  ) {
    await this.reportService.create(currentUser, body);
    return res.sendStatus(201);
  }

  @Patch('/:id')
  @UseGuards(AdminAuthGuard)
  async checkReport(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: CheckReportRquestDto,
    @Res() res: IResponse,
  ) {
    await this.reportService.checkReport(id, user, body.approved);
    return res.sendStatus(200);
  }
}
