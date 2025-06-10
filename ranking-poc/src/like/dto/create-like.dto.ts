import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  @IsNumber()
  fromUserId: number;

  @IsNotEmpty()
  @IsNumber()
  toUserId: number;
}
