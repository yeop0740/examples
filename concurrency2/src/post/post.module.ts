import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LockModule } from '../lock/lock.module';

@Module({
  imports: [PrismaModule, LockModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
