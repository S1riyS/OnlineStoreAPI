import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get(':slug')
  getOneBySlug(@Param('slug') slug: string) {}

  @Post()
  create(@Body() dto: CreateItemDto) {}

  @Put(':id')
  edit(@Param('id', ParseIntPipe) itemId: number) {}
}
