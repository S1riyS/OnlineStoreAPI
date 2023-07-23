import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto';
import { simplifiedItemSelectObject } from '../common/constants';
import { Cron, CronExpression } from '@nestjs/schedule';

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
    const cart = await this.prismaService.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        items: {
          select: {
            item: {
              select: simplifiedItemSelectObject,
            },
            counter: true,
          },
        },
      },
    });

    return cart;
  }

  async addItem(cartId: number, dto: AddCartItemDto) {
    await this.checkItemAndCartExistence(cartId, dto.itemId);

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
    await this.checkItemAndCartExistence(cartId, dto.itemId);

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

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async deleteUnusedUnauthorizedCarts() {
    const now = +new Date();
    const twoWeeks = 1000 * 60 * 60 * 24 * 7 * 2;
    //              milliseconds, seconds, minutes, hours, days, weeks

    await this.prismaService.cart.deleteMany({
      where: {
        updatedAt: {
          lte: new Date(now - twoWeeks),
        },
        userId: null,
      },
    });
  }

  private async checkItemAndCartExistence(
    cartId: number,
    itemId: number,
  ): Promise<void> {
    const isItemExist = !!(await this.prismaService.item.findFirst({
      where: {
        id: itemId,
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
