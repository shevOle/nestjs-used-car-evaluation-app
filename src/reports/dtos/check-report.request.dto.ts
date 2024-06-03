import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CheckReportRequestDto {
  @ApiProperty({
    description: 'Identifies if a report is approved or rejected',
  })
  @IsBoolean({ message: 'Approve property should be a boolean' })
  approved: boolean;
}
