import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import { UserToken } from 'src/token/entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserToken])],
  controllers: [UsersController],
  providers: [UsersService, JwtService, ConfigService, TokenService],
})
export class UsersModule {}
