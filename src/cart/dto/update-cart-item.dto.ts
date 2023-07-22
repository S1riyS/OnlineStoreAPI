import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddCartItem {
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  counter: number;
}

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsNotEmpty()
  @IsInt()
  counter: number;
}
