import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AdditionalProp {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  additionalPropId: number;

  @IsNotEmpty()
  @IsString()
  value: string;
}
