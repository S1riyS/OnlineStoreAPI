import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AddCartItemResponse,
  CreateCartResponse,
  GetCartResponse,
  UpdateCartItemResponse,
} from './types';
import { NotFoundInterceptor } from '../common/interceptors';
import { ApiError } from '../common/types';

@Controller('carts')
@ApiTags('Carts')
export class CartController {
  constructor(private cartService: CartService) {}
  @Post('unauthorized')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates cart for unauthorized user' })
  @ApiCreatedResponse({ type: CreateCartResponse })
  createUnauthorized() {
    return this.cartService.createUnauthorized();
  }

  @Delete('unauthorized/:id')
  @ApiOperation({ summary: 'Deletes cart (of unauthorized users only)' })
  deleteUnauthorized(@Param('id', ParseIntPipe) cartId: number) {
    return this.cartService.deleteUnauthorized(cartId);
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('Category not found'))
  @ApiOperation({ summary: 'Returns cart with given ID' })
  @ApiOkResponse({ type: GetCartResponse })
  @ApiNotFoundResponse({ description: 'Category not found', type: ApiError })
  getOne(@Param('id', ParseIntPipe) cartId: number) {
    return this.cartService.getOne(cartId);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Adds item to cart with given ID' })
  @ApiOkResponse({ type: AddCartItemResponse })
  @ApiBadRequestResponse({
    description: 'This item is already in the cart',
    type: ApiError,
  })
  @ApiNotFoundResponse({
    description: 'Cart of item not found',
    type: ApiError,
  })
  addItem(
    @Param('id', ParseIntPipe) cartId: number,
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(cartId, dto);
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Updates content of the cart ' +
      '(increments counter or deletes item if counter is less than 1)',
  })
  @ApiOkResponse({ type: UpdateCartItemResponse })
  @ApiNotFoundResponse({
    description: 'Cart of item not found',
    type: ApiError,
  })
  updateItem(
    @Param('id', ParseIntPipe) cartId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(cartId, dto);
  }
}
