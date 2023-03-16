import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtUserStrategy } from 'src/auth/jwt-auth.guard';
import { DecorateAll } from 'decorate-all';
import { PostQueryDto } from './dto/post-query.dto';

@ApiTags('Posts')
@ApiBearerAuth('JWT')
@UseGuards(JwtUserStrategy)
@DecorateAll(ApiBadRequestResponse({ description: 'Bad Request' }))
@DecorateAll(ApiNotAcceptableResponse({ description: 'Not Accepted' }))
@DecorateAll(ApiUnauthorizedResponse({ description: 'Unauthorized' }))
@DecorateAll(
  ApiServiceUnavailableResponse({ description: 'Service Unavailable' }),
)
@Controller('api/v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body(ValidationPipe) createPostDto: CreatePostDto, @Req() req) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  findAll(@Query(ValidationPipe) query: PostQueryDto, @Req() req) {
    return this.postsService.findAll(query, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
