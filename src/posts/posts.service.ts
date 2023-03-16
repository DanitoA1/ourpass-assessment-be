import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private categoriesService: CategoriesService,
  ) {}

  async create(data: CreatePostDto, user: User) {
    const { categoryId, ...postData } = data;

    const category = await this.categoriesService.findOne(categoryId);

    const post = this.postRepository.create({
      ...postData,
      category,
      user,
    });

    await this.postRepository.save(post);
    delete post['user']['password'];

    return {
      status: true,
      message: 'Post created successful',
      post,
    };
  }

  async findAll(query: PostQueryDto, user: User) {
    const posts = await this.postRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        category: query.includeCategory === 'true',
        user: query.includeUser === 'true',
      },
    });
    return posts;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
      },
    });
    if (!post) throw new NotFoundException(`No post with id: ${id} found`);
    return post;
  }

  async update(id: number, data: UpdatePostDto) {
    const post = await this.findOne(id);
    let category = post.category;
    if (data.categoryId && data.categoryId !== post.category.id) {
      category = await this.categoriesService.findOne(data.categoryId);
    }
    post.category = category;
    post.content = data.content || post.content;
    post.description = data.description || post.description;
    post.title = data.title || post.title;

    await this.postRepository.save(post);

    return {
      status: true,
      message: 'post updated successfully',
      post,
    };
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    await this.postRepository.delete({ id: post.id });

    return {
      status: true,
      message: `post: ${post.title} deleted successfully`,
    };
  }
}
