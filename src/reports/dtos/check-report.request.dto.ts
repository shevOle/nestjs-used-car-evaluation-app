import { IsBoolean } from 'class-validator';

export class CheckReportRquestDto {
  @IsBoolean({ message: 'Approve property should be a boolean' })
  approved: boolean;
}
