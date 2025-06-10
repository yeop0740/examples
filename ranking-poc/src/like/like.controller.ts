import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Delete(':fromUserId/:toUserId')
  remove(
    @Param('fromUserId', ParseIntPipe) fromUserId: number,
    @Param('toUserId', ParseIntPipe) toUserId: number,
  ) {
    return this.likeService.remove(fromUserId, toUserId);
  }
}
