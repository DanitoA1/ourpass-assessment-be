import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from './users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { UserToken } from './token/entities/token.entity';
import { UserStrategy } from './auth/jwt.strategy';
import { UsersService } from './users/users.service';
import { TokenService } from './token/token.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ourpass_assessment',
      entities: [User, UserToken],
      synchronize: true,
    }),
    UsersModule,
    TypeOrmModule.forFeature([User, UserToken]),
    TokenModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    ConfigService,
    UserStrategy,
    UsersService,
    TokenService,
  ],
})
export class AppModule {}
