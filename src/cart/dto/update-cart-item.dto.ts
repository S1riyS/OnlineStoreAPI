import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsNotEmpty()
  @IsInt()
  counter: number;
}
