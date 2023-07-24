import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { CartItem } from '../../cart/types';
import { OrderDetailsDto } from '../dto';

class OrderDetails extends OrderDetailsDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty()
  updatedAt: Date;
}

class OrderItem extends CartItem {}

export class CreateOrderResponse {
  @ApiProperty({ example: 2 })
  id: number;
}

export class GetOrderResponse {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.BEING_DELIVERED,
  })
  status: OrderStatus;

  @ApiProperty({ type: OrderDetails })
  details: OrderDetails;

  @ApiProperty({ type: [OrderItem] })
  items: OrderItem[];
}
