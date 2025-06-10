import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '../../generated/prisma';

@Module({
  imports: [PrismaClient],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
