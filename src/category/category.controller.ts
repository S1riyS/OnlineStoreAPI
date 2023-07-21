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
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiError } from '../common/types';
import { AtGuard } from '../common/guards';
import { NotFoundInterceptor } from '../common/interceptors';
import {
  CreateCategoryResponse,
  GetCategoryPropsResponse,
  GetCategoryResponse,
  GetCategoryTreeResponse,
} from './types';

@Controller('categories')
@ApiTags('Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Creates new category' })
  @ApiCreatedResponse({ type: CreateCategoryResponse })
  @ApiBadRequestResponse({
    description:
      'Nesting level will be higher than 3 or ' +
      'Category with such name already exists',
    type: ApiError,
  })
  @ApiUnauthorizedResponse({
    description: 'User is unauthorized',
    type: ApiError,
  })
  @ApiNotFoundResponse({
    description: 'Incorrect ID of parent category',
    type: ApiError,
  })
  @ApiBearerAuth('JWT-auth')
  create(@Body() dto: CreateCategoryDto) {
    console.log(dto);
    return this.categoryService.create(dto);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Returns full tree of categories' })
  @ApiOkResponse({ type: [GetCategoryTreeResponse] })
  getFullTree() {
    return this.categoryService.getFullTree();
  }

  @Get('tree/:id')
  @ApiOperation({ summary: 'Returns tree of category with given ID' })
  @ApiOkResponse({ type: GetCategoryTreeResponse })
  @ApiNotFoundResponse({ description: 'Category not found', type: ApiError })
  @UseInterceptors(new NotFoundInterceptor('Category not found'))
  getTreeById(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getTreeById(categoryId);
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('Category not found'))
  @ApiOperation({ summary: 'Returns category with given ID' })
  @ApiOkResponse({ type: GetCategoryResponse })
  @ApiNotFoundResponse({ description: 'Category not found', type: ApiError })
  getOneById(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getOneByID(categoryId);
  }

  @Get(':id/properties')
  @ApiOperation({ summary: 'Returns properties of category with given ID' })
  @ApiOkResponse({ type: [GetCategoryPropsResponse] })
  @ApiNotFoundResponse({ description: 'Category not found', type: ApiError })
  getProperties(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getProperties(categoryId);
  }
}
