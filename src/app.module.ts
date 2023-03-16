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
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { Category } from './categories/entities/category.entity';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    TypeOrmModule.forFeature([User, UserToken]),
    TokenModule,
    CategoriesModule,
    PostsModule,
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
