import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '../../generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: Logger;

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
      errorFormat: 'pretty',
    });
    this.logger = new Logger(PrismaService.name);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    this.log();
    await this.$connect();
  }

  log() {
    this.$on('query', (e) => this.logger.log(`[query]: ${e.query}`));
    this.$on('info', (e) => this.logger.log(e.message));
    this.$on('warn', (e) => this.logger.log(e));
    this.$on('error', (e) => this.logger.log(e));
  }
}
