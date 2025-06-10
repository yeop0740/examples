import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LikeRepository } from './like.repository';

@Module({
  controllers: [LikeController],
  providers: [LikeService, LikeRepository, PrismaService],
})
export class LikeModule {}
