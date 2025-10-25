import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/v1')
  createV1(
    @Request() req: Request & { user: { userId: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createV1(req.user.userId, createPostDto);
  }

  @Post('/v2')
  createV2(
    @Request() req: Request & { user: { userId: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createV2(req.user.userId, createPostDto);
  }

  @Post('/v3')
  createV3(
    @Request() req: Request & { user: { userId: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createV3(req.user.userId, createPostDto);
  }

  @Post('/v4')
  createV4(
    @Request() req: Request & { user: { userId: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createV4(req.user.userId, createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
