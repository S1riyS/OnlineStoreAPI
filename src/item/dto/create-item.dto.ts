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
  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  additionalPropId: number;

  @ApiProperty({ example: 'Socket AM4' })
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class CreateItemDto {
  @ApiProperty({ example: 'AMD Ryzen 5 5600X BOX' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 15999 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  price: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  @ApiProperty({ example: 2 })
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
