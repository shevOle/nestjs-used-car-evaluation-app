import { IsBoolean } from 'class-validator';

export class CheckReportRquestDto {
  @IsBoolean()
  approved: boolean;
}
