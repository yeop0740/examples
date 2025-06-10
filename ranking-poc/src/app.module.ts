import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LikeModule } from './like/like.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, LikeModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
