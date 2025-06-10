import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Like } from '../../generated/prisma';

@Injectable()
export class LikeRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserIds(
    fromUserId: number,
    toUserId: number,
  ): Promise<Like | null> {
    return this.prisma.like.findFirst({
      where: {
        fromUserId,
        toUserId,
      },
    });
  }

  async create(fromUserId: number, toUserId: number): Promise<Like> {
    return this.prisma.like.create({
      data: {
        fromUserId,
        toUserId,
      },
    });
  }

  async delete(fromUserId: number, toUserId: number): Promise<Like> {
    return this.prisma.like.delete({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });
  }
}
