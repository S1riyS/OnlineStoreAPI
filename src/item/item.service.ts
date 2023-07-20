import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlugService } from 'nestjs-slug';
import { FilesService } from '../files/files.service';
import { CreateItemDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  private additionalPropsSelectObject: Prisma.ItemAdditionalPropsSelect = {
    id: true,
    additionalProp: {
      select: {
        name: true,
      },
    },
    value: true,
  };
  constructor(
    private prismaService: PrismaService,
    private fileService: FilesService,
    private slugService: SlugService,
  ) {}

  async create(dto: CreateItemDto, image: any) {
    const slug = this.slugService.generateSlug(dto.name);

    // Checking if item with given name already exists
    const candidate = await this.prismaService.item.findUnique({
      where: {
        slug: slug,
      },
    });
    if (candidate)
      throw new BadRequestException('Item with this name already exists');

    // Checking if category satisfies all requirements
    const category = await this.prismaService.category.findUnique({
      where: {
        id: dto.categoryId,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.nestingLevel <= 1) {
      throw new BadRequestException(
        'Nesting level of category must by at least 2',
      );
    }

    const fileName = await this.fileService.createFile(image);
    return this.prismaService.item.create({
      data: {
        name: dto.name,
        slug: slug,
        description: dto.description,
        price: dto.price,
        image: fileName,
        categoryId: dto.categoryId,
        additionalProps: {
          createMany: {
            data: dto.additionalProps,
          },
        },
      },
      include: {
        additionalProps: {
          select: this.additionalPropsSelectObject,
        },
      },
    });
  }

  async getObeBySlug(slug: string) {
    return this.prismaService.item.findUnique({
      where: {
        slug: slug,
      },
      include: {
        additionalProps: {
          select: this.additionalPropsSelectObject,
        },
      },
    });
  }

  async getOneById(itemId: number) {
    return this.prismaService.item.findUnique({
      where: {
        id: itemId,
      },
      include: {
        additionalProps: {
          select: this.additionalPropsSelectObject,
        },
      },
    });
  }
}
