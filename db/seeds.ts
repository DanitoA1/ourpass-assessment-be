import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

export const userSeeds: CreateUserDto[] = [
  {
    firstName: 'Daniel',
    lastName: 'Ahiaba',
    email: 'ahiabadaniel@gmail.com',
    password: 'testPassword',
  },
  {
    firstName: 'Ourpass',
    lastName: 'Staff',
    email: 'staff@ourpass.com',
    password: 'user123',
  },
];

export const categorySeeds: CreateCategoryDto[] = [
  {
    name: 'News',
  },
  {
    name: 'Football',
  },
  {
    name: 'Music',
  },
];

export const postSeeds: CreatePostDto[] = [
  {
    title: 'Post 1',
    description: 'Just Some Test Post',
    content: 'Just some Test content to go in here',
    categoryId: 1,
  },
];
