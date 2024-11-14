import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EventDatesDTO {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    endDate: Date;
}
