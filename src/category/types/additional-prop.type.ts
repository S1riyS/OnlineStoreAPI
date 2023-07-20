import { IsNotEmpty, IsString } from 'class-validator';

export class AdditionalProp {
  @IsNotEmpty()
  @IsString()
  name: string;
}
