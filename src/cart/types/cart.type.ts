import { ApiProperty } from '@nestjs/swagger';
import { GetItemSimplifiedResponse } from '../../item/types';

class CartItem {
  @ApiProperty()
  item: GetItemSimplifiedResponse;

  @ApiProperty({ example: 2 })
  counter: number;
}

class Cart {
  @ApiProperty({ example: 6 })
  id: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ example: 2 })
  userId: number;

  @ApiProperty({ type: [CartItem] })
  items: CartItem[];
}

export class CreateCartResponse {
  @ApiProperty({ example: 6, description: 'ID of cart' })
  id: number;
}

export class GetCartResponse extends Cart {}

export class AddCartItemResponse extends Cart {}

export class UpdateCartItemResponse extends Cart {}
