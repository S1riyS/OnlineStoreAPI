import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  counter: number;
}
