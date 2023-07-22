import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto';

@Controller('carts')
export class CartController {
  constructor(private cartService: CartService) {}
  @Post('unauthorized')
  createUnauthorized() {
    return this.cartService.createUnauthorized();
  }

  @Delete('unauthorized/:id')
  deleteUnauthorized(@Param('id', ParseIntPipe) cartId: number) {
    return this.cartService.deleteUnauthorized(cartId);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) cartId: number) {
    return this.cartService.getOne(cartId);
  }

  @Post(':id')
  addItem(
    @Param('id', ParseIntPipe) cartId: number,
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(cartId, dto);
  }

  @Put(':id')
  updateItem(
    @Param('id', ParseIntPipe) cartId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(cartId, dto);
  }
}
