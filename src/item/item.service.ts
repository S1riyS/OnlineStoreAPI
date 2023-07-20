import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlugService } from 'nestjs-slug';
import { FilesService } from '../files/files.service';
import { CreateItemDto } from './dto';

@Injectable()
export class ItemService {
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
    });
  }

  async getObeBySlug(slug: string) {
    return this.prismaService.item.findUnique({
      where: {
        slug: slug,
      },
    });
  }

  async getOneById(itemId: number) {
    return this.prismaService.item.findUnique({
      where: {
        id: itemId,
      },
    });
  }

  async getProperties(itemId: number) {
    // Getting properties of category to which item belongs and properties of item itself
    const item = await this.prismaService.item.findUnique({
      where: {
        id: itemId,
      },
      select: {
        category: {
          select: {
            additionalProps: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        additionalProps: {
          select: {
            additionalPropId: true,
            value: true,
          },
        },
      },
    });
    const categoryProps = item.category.additionalProps;
    const itemProps = item.additionalProps;

    // Converting properties of item to dict
    const itemPropsDict: { [id: string]: string } = {};
    for (const itemProp of itemProps) {
      itemPropsDict[itemProp.additionalPropId] = itemProp.value;
    }

    // Updating local version of category properties with values from dict of item properties
    const itemPropsDictKeys = Object.keys(itemPropsDict);
    categoryProps.map((property) => {
      const propertyIdString = property.id.toString();

      if (itemPropsDictKeys.includes(propertyIdString)) {
        property['value'] = itemPropsDict[property.id];
      } else {
        property['value'] = null;
      }
    });

    return categoryProps;
  }
}
