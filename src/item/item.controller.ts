import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundInterceptor } from '../common/interceptors';
import { CreateItemDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateItemResponse,
  GetItemResponse,
  PropertiesResponse,
} from './types';
import { ApiError } from '../common/types';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Creates new item' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: CreateItemResponse })
  @ApiBadRequestResponse({
    description:
      'Item with this name already exists or ' +
      'Nesting level of category is lower than 2',
    type: ApiError,
  })
  @ApiNotFoundResponse({
    description: 'Category with given ID not found',
    type: ApiError,
  })
  create(@Body() dto: CreateItemDto, @UploadedFile() image: any) {
    return this.itemService.create(dto, image);
  }

  @Get('/search')
  @UseInterceptors(new NotFoundInterceptor('Item not found'))
  @ApiOperation({
    summary:
      'Finds item with given parameters ' +
      '(at the moment only search by slug is implemented)',
  })
  @ApiOkResponse({ type: GetItemResponse })
  @ApiNotFoundResponse({ description: 'Item not found', type: ApiError })
  getOneBySlug(@Query('slug') slug: string) {
    return this.itemService.getObeBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Finds item with given ID' })
  @ApiOkResponse({ type: GetItemResponse })
  @ApiNotFoundResponse({ description: 'Item not found', type: ApiError })
  getOneById(@Param('id', ParseIntPipe) itemId: number) {
    return this.itemService.getOneById(itemId);
  }

  @Get(':id/properties')
  @UseInterceptors(new NotFoundInterceptor('Item not found'))
  @ApiOperation({ summary: 'Returns properties of item with given ID' })
  @ApiOkResponse({ type: [PropertiesResponse] })
  @ApiNotFoundResponse({ description: 'Item not found', type: ApiError })
  getProperties(@Param('id', ParseIntPipe) itemId: number) {
    return this.itemService.getProperties(itemId);
  }
}
