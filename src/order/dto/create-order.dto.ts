import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderDetailsDto {
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  cartId: number;

  @ValidateNested({ each: true })
  @Type(() => OrderDetailsDto)
  details: OrderDetailsDto;
}
