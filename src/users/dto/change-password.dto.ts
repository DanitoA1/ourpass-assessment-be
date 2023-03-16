import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  current_password: string;

  @ApiProperty({ required: true })
  @IsString()
  new_password: string;
}
