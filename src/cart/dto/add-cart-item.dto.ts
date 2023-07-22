import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  counter: number;
}
