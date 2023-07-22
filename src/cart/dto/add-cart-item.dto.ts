import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  counter: number;
}
