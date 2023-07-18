import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CategoryEntity, CategoryWithChildrenEntity } from './category.entity';
import { ApiError } from '../common/types';
import { AtGuard } from '../common/guards';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Creates new category' })
  @ApiCreatedResponse({ type: CategoryEntity })
  @ApiBadRequestResponse({
    description:
      'Incorrect ID of parent category or ' +
      'Nesting level will be higher than 3 or ' +
      'Category with such name already exists',
    type: ApiError,
  })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) {
    console.log(dto);
    return this.categoryService.create(dto);
  }

  @ApiOperation({ summary: 'Returns full tree of categories' })
  @ApiOkResponse({ type: [CategoryWithChildrenEntity] })
  @Get('tree')
  getFullTree() {
    return this.categoryService.getFullTree();
  }

  @ApiOperation({ summary: 'Returns tree of category with given ID' })
  @ApiOkResponse({ type: CategoryWithChildrenEntity })
  @Get('tree/:id')
  getTreeById(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getTreeById(categoryId);
  }
}
