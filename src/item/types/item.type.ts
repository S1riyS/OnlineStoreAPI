import { ApiProperty } from '@nestjs/swagger';

class SimplifiedItem {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'AMD Ryzen 5 5600X BOX' })
  name: string;

  @ApiProperty({ example: '9b77bf06-8e65-4787-b77e-9146a81c4bca.jpg' })
  image: string;

  @ApiProperty({ example: 15999 })
  price: number;
}

class Item extends SimplifiedItem {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ example: 'AMD-Ryzen-5-5600X-BOX' })
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ example: 2 })
  categoryId: number;
}

export class CreateItemResponse extends Item {}

export class GetItemResponse extends Item {}

export class GetItemSimplifiedResponse extends SimplifiedItem {}

export class PropertiesResponse {
  @ApiProperty({
    example: 1,
    description:
      'NOTE: This number refers to ID of record in AdditionalProp table',
  })
  id: number;

  @ApiProperty({ example: 'CPU Speed' })
  name: string;

  @ApiProperty({ nullable: true, example: '4.6 GHz' })
  value?: string;
}
