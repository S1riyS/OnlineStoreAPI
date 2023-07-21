import { ApiProperty } from '@nestjs/swagger';

class AdditionalPropValue {
  @ApiProperty({ example: '4.6 GHz' })
  value: string;

  @ApiProperty({ example: 5 })
  counter: number;
}

export class GetCategoryPropsResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'CPU Speed' })
  name: string;

  @ApiProperty({ type: [AdditionalPropValue] })
  values: AdditionalPropValue[];
}
