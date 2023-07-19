import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundInterceptor } from '../common/interceptors';
import { CreateItemDto } from './dto';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() dto: CreateItemDto, @UploadedFile() image: any) {
    console.log(dto, image);
    return this.itemService.create(dto, image);
  }

  @Get('/search')
  @UseInterceptors(new NotFoundInterceptor('Item not found'))
  getOneBySlug(@Query('slug') slug: string) {
    return this.itemService.getObeBySlug(slug);
  }

  @Get(':id')
  // @UseInterceptors(new NotFoundInterceptor('Item not found'))
  GetOneById(@Param('id', ParseIntPipe) itemId: number) {
    return this.itemService.getOneById(itemId);
  }

  @Put(':id')
  edit(@Param('id', ParseIntPipe) itemId: number) {}
}
