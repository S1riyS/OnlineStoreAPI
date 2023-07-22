import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItem, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}
  async createUnauthorized() {
    return this.prismaService.cart.create({
      data: {},
      select: {
        id: true,
      },
    });
  }

  async deleteUnauthorized(cartId: number) {
    await this.prismaService.cart.deleteMany({
      where: {
        id: cartId,
        userId: null,
      },
    });
  }

  async getOne(cartId: number) {
    return this.prismaService.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        items: true,
      },
    });
  }

  async addItem(cartId: number, dto: AddCartItem) {
    await this.checkItemAndCartExistence(cartId, dto);

    const isItemAlreadyInCart = !!(await this.prismaService.cartItems.findFirst(
      {
        where: {
          cartId: cartId,
          itemId: dto.itemId,
        },
      },
    ));
    if (isItemAlreadyInCart) {
      throw new BadRequestException('This item is already in the cart');
    }

    await this.prismaService.cartItems.create({
      data: {
        cartId: cartId,
        itemId: dto.itemId,
        counter: dto.counter,
      },
    });
    return this.getOne(cartId);
  }

  async updateItem(cartId: number, dto: UpdateCartItemDto) {
    await this.checkItemAndCartExistence(cartId, dto);

    if (dto.counter > 0) {
      // Updating counter of item
      await this.prismaService.cartItems.updateMany({
        where: {
          cartId: cartId,
          itemId: dto.itemId,
        },
        data: {
          counter: dto.counter,
        },
      });
    } else {
      // Deleting item from cart
      await this.prismaService.cartItems.deleteMany({
        where: {
          cartId: cartId,
          itemId: dto.itemId,
        },
      });
    }
    return this.getOne(cartId);
  }

  private async checkItemAndCartExistence(
    cartId: number,
    dto: AddCartItem | UpdateCartItemDto,
  ): Promise<void> {
    const isItemExist = !!(await this.prismaService.item.findFirst({
      where: {
        id: dto.itemId,
      },
    }));
    if (!isItemExist) {
      throw new NotFoundException('Item not found');
    }

    const isCartExist = !!(await this.prismaService.cart.findFirst({
      where: {
        id: cartId,
      },
    }));
    if (!isCartExist) {
      throw new NotFoundException('Cart not found');
    }
  }
}
