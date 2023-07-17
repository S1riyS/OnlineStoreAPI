import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    console.log(dto);
    return this.categoryService.create(dto);
  }

  @Get('tree')
  getFullTree() {
    return this.categoryService.getFullTree();
  }

  @Get('tree/:id')
  getTreeById(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getTreeById(categoryId);
  }
}
