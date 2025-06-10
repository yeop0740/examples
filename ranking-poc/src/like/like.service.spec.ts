import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { LikeRepository } from './like.repository';
import { createMock } from '@golevelup/ts-jest';
import { Like } from '../../generated/prisma';

describe('LikeService', () => {
  let likeService: LikeService;
  let likeRepository: jest.Mocked<LikeRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: LikeRepository,
          useValue: createMock<LikeRepository>(),
        },
      ],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
    likeRepository = module.get(LikeRepository);
  });

  it('서비스가 정상적으로 생성된다.', () => {
    expect(likeService).toBeDefined();
  });

  describe('좋아요 생성', () => {
    it('Like가 존재하지 않으면 새로운 Like를 생성한다.', async () => {
      // given
      const fromUserId = 1;
      const toUserId = 2;
      const createLikeDto = { fromUserId, toUserId };
      const like: Like = {
        id: 1,
        fromUserId,
        toUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      likeRepository.findByUserIds.mockResolvedValue(null);
      likeRepository.create.mockResolvedValue(like);

      // when
      const result = await likeService.create(createLikeDto);

      // then
      expect(result).toEqual(like);
      expect(likeRepository.findByUserIds).toHaveBeenCalledWith(
        fromUserId,
        toUserId,
      );
      expect(likeRepository.create).toHaveBeenCalledWith(fromUserId, toUserId);
    });

    it('Like가 이미 존재하면 기존 Like를 반환하고 새로 생성하지 않는다.', async () => {
      // given
      const fromUserId = 1;
      const toUserId = 2;
      const createLikeDto = { fromUserId, toUserId };
      const existingLike: Like = {
        id: 1,
        fromUserId,
        toUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      likeRepository.findByUserIds.mockResolvedValue(existingLike);

      // when
      const result = await likeService.create(createLikeDto);

      // then
      expect(result).toEqual(existingLike);
      expect(likeRepository.findByUserIds).toHaveBeenCalledWith(
        fromUserId,
        toUserId,
      );
      expect(likeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('fromUserId와 toUserId에 해당하는 Like를 삭제한다.', async () => {
      // given
      const fromUserId = 1;
      const toUserId = 2;
      const like: Like = {
        id: 1,
        fromUserId,
        toUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      likeRepository.delete.mockResolvedValue(like);

      // when
      const result = await likeService.remove(fromUserId, toUserId);

      // then
      expect(result).toEqual(like);
      expect(likeRepository.delete).toHaveBeenCalledWith(fromUserId, toUserId);
    });
  });
});
