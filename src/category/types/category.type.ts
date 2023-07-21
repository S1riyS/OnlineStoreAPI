import { ApiProperty } from '@nestjs/swagger';
import { GetItemResponse } from '../../item/types';

class Category {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 2 })
  nestingLevel: number;

  @ApiProperty({ required: false, nullable: true, example: 1 })
  parentId: 1;
}

export class CreateCategoryResponse extends Category {}

export class GetCategoryTreeResponse extends Category {
  @ApiProperty({
    type: [Category],
    example: [
      {
        id: 2,
        createdAt: '2023-07-17T15:56:14.342Z',
        updatedAt: '2023-07-17T15:56:14.342Z',
        name: 'PC accessories',
        nestingLevel: 2,
        parentId: 1,
        childCategories: [],
      },
    ],
  })
  childCategories: Category[];
}

export class GetCategoryResponse extends Category {
  @ApiProperty({ type: [GetItemResponse] })
  items: GetItemResponse[];
}
