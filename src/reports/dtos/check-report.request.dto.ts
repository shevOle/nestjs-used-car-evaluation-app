import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReportStatuses } from '../../db/entities/report.entity';

export class CheckReportRequestDto {
  @ApiProperty({
    description: 'Identifies if a report is approved or rejected',
  })
  @IsEnum(ReportStatuses, { message: 'Invalid report status' })
  status: ReportStatuses;
}
