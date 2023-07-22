import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto';
import { Prisma } from '@prisma/client';
import { simplifiedItemSelectObject } from '../common/constants';

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
        items: {
          select: simplifiedItemSelectObject,
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
    const isCategoryExists = !!(await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
      },
    }));
    if (!isCategoryExists) {
      throw new NotFoundException('Category not found');
    }

    return this.generateTree(categoryId);
  }

  async getProperties(categoryId: number) {
    // Getting all properties of category
    const categoryWithProperties = await this.prismaService.category.findUnique(
      {
        where: {
          id: categoryId,
        },
        select: {
          additionalProps: {
            select: this.additionalPropsSelectObject,
          },
        },
      },
    );
    if (!categoryWithProperties) {
      throw new NotFoundException('Category not found');
    }
    const categoryProps = categoryWithProperties.additionalProps;

    // Extracting IDs of properties
    const categoryPropsIDs: number[] = [];
    for (const property of categoryProps) {
      categoryPropsIDs.push(property.id);
    }

    // Getting all existing values and their quantity (from items of given category)
    const itemsProps = await this.prismaService.itemAdditionalProps.groupBy({
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

    // Turning the received data into a dictionary
    const itemsPropsDict: {
      [propId: string]: Array<{ value: string; counter: number }>;
    } = {};
    for (const property of itemsProps) {
      const data = {
        value: property.value,
        counter: property._count.value,
      };

      if (itemsPropsDict[property.additionalPropId]) {
        itemsPropsDict[property.additionalPropId].push(data);
      } else {
        itemsPropsDict[property.additionalPropId] = [data];
      }
    }

    // Updating properties of category with data from `itemsPropsDict`
    // e.g. {id: 1, name: 'Width'} -> {id: 1, name: 'Weight', values: [{value: '5 kg', counter: 3}]}
    // Thus, in this category there are 3 items weighing 5 kilograms each
    categoryProps.map((property) => {
      property['values'] = itemsPropsDict[property.id] || [];
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
