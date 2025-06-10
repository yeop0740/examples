import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeRepository } from './like.repository';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async create(createLikeDto: CreateLikeDto) {
    const { fromUserId, toUserId } = createLikeDto;

    const existingLike = await this.likeRepository.findByUserIds(
      fromUserId,
      toUserId,
    );

    if (existingLike) {
      return existingLike;
    }

    return this.likeRepository.create(fromUserId, toUserId);
  }

  async remove(fromUserId: number, toUserId: number) {
    return this.likeRepository.delete(fromUserId, toUserId);
  }
}
