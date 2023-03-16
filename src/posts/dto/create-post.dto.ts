import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsString()
  content: string;

  @ApiProperty({ required: true })
  @IsNumber()
  categoryId: number;
}
