import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from '../../generated/prisma';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createMock } from '@golevelup/ts-jest';

const mockLike: Like = {
  id: 1,
  fromUserId: 1,
  toUserId: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('LikeController', () => {
  let app: INestApplication;
  let likeService: jest.Mocked<LikeService>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [
        {
          provide: LikeService,
          useValue: createMock<LikeService>(),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    likeService = moduleRef.get(LikeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /likes', () => {
    it('Like를 생성하고 결과를 반환한다.', async () => {
      // given
      const dto: CreateLikeDto = { fromUserId: 1, toUserId: 2 };
      likeService.create.mockResolvedValue(mockLike);

      // when & then
      await request(app.getHttpServer())
        .post('/likes')
        .send(dto)
        .expect(201)
        .expect(mockLike);
      expect(likeService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('DELETE /likes/:fromUserId/:toUserId', () => {
    it('Like를 삭제하고 결과를 반환한다.', async () => {
      // given
      likeService.remove.mockResolvedValue(mockLike);

      // when & then
      await request(app.getHttpServer())
        .delete('/likes/1/2')
        .expect(200)
        .expect(mockLike);
      expect(likeService.remove).toHaveBeenCalledWith(1, 2);
    });
  });
});
