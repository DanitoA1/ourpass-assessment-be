import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (users) => users.posts)
  user: User;

  @ManyToOne(() => Category, (categories) => categories.posts)
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}
