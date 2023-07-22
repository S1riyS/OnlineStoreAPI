import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  counter: number;
}
