import { ApiProperty } from '@nestjs/swagger';
import { AdditionalProp } from './additional-prop.type';

class Category {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 1 })
  nestingLevel: number;

  @ApiProperty({ required: false, nullable: true, example: null })
  parentId: number;
}

class CategoryWithChildren extends Category {
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
  childCategories: [Category];
}

export class CreateCategoryResponse extends CategoryWithChildren {}

export class CategoryTreeResponse extends CategoryWithChildren {}

export class GetOneResponse extends CategoryWithChildren {
  @ApiProperty({
    type: [AdditionalProp],
    example: [
      {
        id: 1,
        name: 'Weight',
      },
      {
        id: 2,
        name: 'Length',
      },
    ],
  })
  additionalProps: [AdditionalProp];
}
