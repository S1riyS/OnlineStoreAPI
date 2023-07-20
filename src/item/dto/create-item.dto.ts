import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AdditionalProp {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  additionalPropId: number;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalProp)
  additionalProps: AdditionalProp[] = [];
}
