import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class AdditionalFeature {
  name: string;
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
  // @IsNumberString({})
  @Type(() => Number)
  @IsInt()
  price: number;

  @IsNotEmpty()
  // @IsNumberString({})
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @IsOptional()
  additionalFeatures: AdditionalFeature[];
}
