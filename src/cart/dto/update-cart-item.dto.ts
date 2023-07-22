import { IsInt, IsNotEmpty } from 'class-validator';

export class AddCartItem {
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsNotEmpty()
  @IsInt()
  counter: number;
}

export class UpdateCartItemDto extends AddCartItem {}
