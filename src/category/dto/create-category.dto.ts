import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AdditionalProp } from '../types';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalProp)
  additionalProps: AdditionalProp[];
}
