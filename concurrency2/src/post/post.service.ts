import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createV1(userId: string, createPostDto: CreatePostDto) {
    const now = new Date();
    const startOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0,
      0,
      0,
    );
    const endOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      59,
      59,
      999,
    );

    const existingPost = await this.prisma.post.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfHour,
          lte: endOfHour,
        },
      },
    });

    if (existingPost) {
      throw new ForbiddenException('You can only create one post per hour.');
    }

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
      },
    });
  }

  async createV2(userId: string, createPostDto: CreatePostDto) {
    const now = new Date();
    const startOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0,
      0,
      0,
    );
    const endOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      59,
      59,
      999,
    );

    return this.prisma.$transaction(async (tx) => {
      const existingPost = await tx.post.findFirst({
        where: {
          userId,
          createdAt: {
            gte: startOfHour,
            lte: endOfHour,
          },
        },
      });

      if (existingPost) {
        throw new ForbiddenException('You can only create one post per hour.');
      }

      return tx.post.create({
        data: {
          ...createPostDto,
          userId,
        },
      });
    });
  }

  async createV3(userId: string, createPostDto: CreatePostDto) {
    const now = new Date();
    const startOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0,
      0,
      0,
    );
    const endOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      59,
      59,
      999,
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw(
        Prisma.sql`SELECT id FROM users WHERE id = ${userId} FOR UPDATE;`,
      );
      const existingPost = await tx.post.findFirst({
        where: {
          userId,
          createdAt: {
            gte: startOfHour,
            lte: endOfHour,
          },
        },
      });

      if (existingPost) {
        throw new ForbiddenException('You can only create one post per hour.');
      }

      return tx.post.create({
        data: {
          ...createPostDto,
          userId,
        },
      });
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
