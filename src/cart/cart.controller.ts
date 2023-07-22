import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';

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
}
