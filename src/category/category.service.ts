import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  private additionalPropsSelectObject: Prisma.AdditionalPropSelect = {
    id: true,
    name: true,
  };
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    let currentNestingLevel = 1;

    if (dto.parentId) {
      const parentCategory = await this.getOneByID(dto.parentId);

      // Checking if parent category exists
      if (!parentCategory)
        throw new BadRequestException('Incorrect ID of parent category');

      // Checking if nesting level isn't higher than 3
      if (parentCategory.nestingLevel >= 3)
        throw new BadRequestException('Max nesting level is 3');

      currentNestingLevel = parentCategory.nestingLevel + 1;
    }

    const candidate = await this.prismaService.category.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (candidate) {
      throw new BadRequestException('Category with such name already exists');
    }

    return this.prismaService.category.create({
      data: {
        name: dto.name,
        parentId: dto.parentId,
        nestingLevel: currentNestingLevel,
        additionalProps: {
          createMany: {
            data: dto.additionalProps,
          },
        },
      },
      include: {
        childCategories: true,
      },
    });
  }

  async getOneByID(categoryId: number) {
    return this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        additionalProps: {
          select: this.additionalPropsSelectObject,
        },
      },
    });
  }

  async getFullTree() {
    const result = [];
    const highestCategories = await this.prismaService.category.findMany({
      where: {
        nestingLevel: 1,
      },
    });

    for (const currentCategory of highestCategories) {
      const subcategories = await this.generateTree(currentCategory.id);
      result.push(subcategories);
    }

    return result;
  }

  async getTreeById(categoryId: number) {
    const category = await this.getOneByID(categoryId);
    return this.generateTree(category.id);
  }

  async getProperties(categoryId: number) {
    const categoryWithProperties = await this.prismaService.category.findUnique(
      {
        where: {
          id: categoryId,
        },
        select: {
          additionalProps: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    );
    const categoryProps = categoryWithProperties.additionalProps;

    const categoryPropsIDs: number[] = [];
    for (const property of categoryProps) {
      categoryPropsIDs.push(property.id);
    }

    const itemProps = await this.prismaService.itemAdditionalProps.groupBy({
      by: ['additionalPropId', 'value'],
      where: {
        additionalPropId: {
          in: categoryPropsIDs,
        },
      },
      _count: {
        value: true,
      },
    });

    const itemPropsDict: {
      [propId: string]: Array<{ value: string; counter: number }>;
    } = {};
    for (const property of itemProps) {
      const data = {
        value: property.value,
        counter: property._count.value,
      };

      if (itemPropsDict[property.additionalPropId]) {
        itemPropsDict[property.additionalPropId].push(data);
      } else {
        itemPropsDict[property.additionalPropId] = [data];
      }
    }

    categoryProps.map((property) => {
      property['values'] = itemPropsDict[property.id] || [];
    });

    return categoryProps;
  }

  private async generateTree(categoryId: number, depth = 4) {
    const includeObject: any = {
      include: { childCategories: true },
    };

    let pointer = includeObject.include;
    for (let i = 0; i < depth - 1; i++) {
      pointer.childCategories = { include: { childCategories: true } };
      pointer = pointer.childCategories.include;
    }

    return this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
      include: includeObject.include,
    });
  }
}
