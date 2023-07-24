import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailsDto {
  @ApiProperty({ example: 'Moscow, Lenina street 123A' })
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@mail.ru' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+447911123456' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  cartId: number;

  @ApiProperty({ type: OrderDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailsDto)
  details: OrderDetailsDto;
}
