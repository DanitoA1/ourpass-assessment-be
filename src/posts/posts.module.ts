import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Category])],
  controllers: [PostsController],
  providers: [PostsService, CategoriesService],
})
export class PostsModule {}
