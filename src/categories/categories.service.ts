import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(data: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      ...data,
    });
    await this.categoryRepository.save(category);
    return {
      status: true,
      message: 'Category successfully created',
      category,
    };
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({
      id,
    });
    if (!category) throw new NotFoundException(`No category with id: ${id}`);
    return category;
  }

  async update(id: number, data: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({
      id,
    });
    if (!category) throw new NotFoundException(`No category with id: ${id}`);

    category.name = data.name;

    await this.categoryRepository.save(category);
    return {
      status: true,
      message: 'Category update successful',
      category,
    };
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({
      id,
    });
    if (!category) throw new NotFoundException(`No category with id: ${id}`);

    await this.categoryRepository.delete({ id: category.id });
    return {
      status: true,
      message: `${category.name} successfully deleted`,
    };
  }
}
