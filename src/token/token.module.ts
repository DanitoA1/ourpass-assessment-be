import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/token.entity';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  providers: [TokenService],
})
export class TokenModule {}
