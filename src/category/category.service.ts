import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    let currentNestingLevel = 1;

    if (dto.parentId) {
      const parentCategory = await this.getOneByID(
        dto.parentId,
        'Incorrect ID of parent category',
      );

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
      },
      include: {
        childCategories: true,
      },
    });
  }

  async getOneByID(categoryId: number, notFoundMessage = 'Category not found') {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(notFoundMessage);
    }
    return category;
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
