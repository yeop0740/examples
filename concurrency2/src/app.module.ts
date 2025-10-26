import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { LockModule } from './lock/lock.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PostModule,
    AuthModule,
    PrismaModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('REDIS_HOST');
        const port = configService.getOrThrow<number>('REDIS_PORT');

        return {
          stores: [
            new Keyv({
              store: new KeyvRedis(`redis://${host}:${port}/0`),
            }),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    LockModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
