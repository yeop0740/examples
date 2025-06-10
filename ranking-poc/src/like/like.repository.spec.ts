import { Test, TestingModule } from '@nestjs/testing';
import { LikeRepository } from './like.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('LikeRepository', () => {
  let likeRepository: LikeRepository;
  let prisma: PrismaService;
  let user1Id: number;
  let user2Id: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeRepository,
        {
          provide: PrismaService,
          useValue: new PrismaService(
            'postgresql://postgres:1234@localhost:5441/postgres?schema=public',
          ),
        },
      ],
    }).compile();

    likeRepository = module.get<LikeRepository>(LikeRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {});

  afterEach(async () => {
    await prisma.like.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findByUserIds', () => {
    it('fromUserId 와 toUserId 로 생성한 좋아요를 조회한다.', async () => {
      // given
      const user1 = await prisma.user.create({ data: { name: 'Test User 1' } });
      const user2 = await prisma.user.create({ data: { name: 'Test User 2' } });
      const createdLike = await prisma.like.create({
        data: {
          fromUserId: user1.id,
          toUserId: user2.id,
        },
      });

      // when
      const foundLike = await likeRepository.findByUserIds(user1.id, user2.id);

      // then
      expect(foundLike).toBeDefined();
      expect(foundLike).toHaveProperty('fromUserId', createdLike.fromUserId);
      expect(foundLike).toHaveProperty('toUserId', createdLike.toUserId);
    });

    it('좋아요가 존재하지 않으면 null을 반환한다.', async () => {
      // given
      const user1 = await prisma.user.create({ data: { name: 'Test User 1' } });
      const user2 = await prisma.user.create({ data: { name: 'Test User 2' } });

      // when
      const result = await likeRepository.findByUserIds(user1.id, user2.id);

      // then
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('새로운 좋아요를 생성한다.', async () => {
      // when
      const createdLike = await likeRepository.create(user1Id, user2Id);

      // then
      expect(createdLike).toBeDefined();
      expect(createdLike).toHaveProperty('fromUserId', user1Id);
      expect(createdLike).toHaveProperty('toUserId', user2Id);

      // Verify in database
      const likeInDb = await prisma.like.findFirst({
        where: {
          fromUserId: user1Id,
          toUserId: user2Id,
        },
      });
      expect(likeInDb).toBeDefined();
      expect(likeInDb).toHaveProperty('id', createdLike.id);
    });
  });

  describe('delete', () => {
    it('좋아요를 삭제한다.', async () => {
      // given
      const createdLike = await prisma.like.create({
        data: {
          fromUserId: user1Id,
          toUserId: user2Id,
        },
      });

      // when
      const deletedLike = await likeRepository.delete(user1Id, user2Id);

      // then
      expect(deletedLike).toHaveProperty('id', createdLike.id);

      // Verify in database
      const likeInDb = await prisma.like.findFirst({
        where: {
          fromUserId: user1Id,
          toUserId: user2Id,
        },
      });
      expect(likeInDb).toBeNull();
    });

    it('존재하지 않는 좋아요를 삭제하려고 하면 에러가 발생한다.', async () => {
      // when & then
      await expect(likeRepository.delete(user1Id, user2Id)).rejects.toThrow();
    });
  });
});
