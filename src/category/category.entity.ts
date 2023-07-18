import { Category } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity implements Category {
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

export class CategoryWithChildrenEntity extends CategoryEntity {
  @ApiProperty({
    type: [CategoryWithChildrenEntity],
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
  childCategories: [CategoryWithChildrenEntity];
}
