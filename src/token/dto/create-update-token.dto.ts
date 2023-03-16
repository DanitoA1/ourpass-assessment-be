import { IsDateString, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateUpdateTokenDto {
  @IsString()
  token: string;

  @IsDateString()
  expiresAt: string;

  user: User;
}
