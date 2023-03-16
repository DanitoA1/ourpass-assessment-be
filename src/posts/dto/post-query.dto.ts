import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

export class PostQueryDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBooleanString()
  includeCategory: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBooleanString()
  includeUser: string;
}
