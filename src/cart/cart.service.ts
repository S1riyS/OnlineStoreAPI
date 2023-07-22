import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}
  async createUnauthorized() {
    const cart = await this.prismaService.cart.create({
      data: {},
      select: {
        id: true,
      },
    });
    return cart;
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

  // async update(dto: updateCartDto, cartId: number) {}
}
