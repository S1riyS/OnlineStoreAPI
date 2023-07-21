import { ApiProperty } from '@nestjs/swagger';

class AdditionalPropValue {
  @ApiProperty({ example: '4 kg' })
  value: string;

  @ApiProperty({ example: 5 })
  counter: number;
}

export class GetCategoryPropsResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Weight' })
  name: string;

  @ApiProperty({ type: [AdditionalPropValue] })
  values: AdditionalPropValue[];
}
