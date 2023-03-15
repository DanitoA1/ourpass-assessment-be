import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;
}
