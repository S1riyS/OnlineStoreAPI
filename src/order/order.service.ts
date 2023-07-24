import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { Prisma } from '@prisma/client';
import { simplifiedItemSelectObject } from '../common/constants';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // Getting cart with items
    const cartWithItems = await this.prismaService.cart.findUnique({
      where: {
        id: dto.cartId,
      },
      select: {
        items: {
          select: {
            item: {
              select: {
                id: true,
                price: true,
              },
            },
            counter: true,
          },
        },
        userId: true,
      },
    });
    if (!cartWithItems) {
      throw new NotFoundException('Cart not found');
    }
    const cartItems = cartWithItems.items;

    // Processing data
    const orderItems: Prisma.OrderItemsCreateManyOrderInput[] = [];
    for (const cartItem of cartItems) {
      const data = {
        itemId: cartItem.item.id,
        price: cartItem.item.price,
        counter: cartItem.counter,
      };
      orderItems.push(data);
    }

    return this.prismaService.order.create({
      data: {
        userId: cartWithItems.userId,
        details: {
          create: {
            deliveryAddress: dto.details.deliveryAddress,
            name: dto.details.name,
            email: dto.details.email,
            phoneNumber: dto.details.phoneNumber,
          },
        },
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  async getOne(orderId: number) {
    return this.prismaService.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        details: true,
        items: {
          select: {
            counter: true,
            item: {
              select: simplifiedItemSelectObject,
            },
          },
        },
      },
    });
  }

  async updateStatus(orderId: number, dto: UpdateOrderStatusDto) {
    await this.prismaService.order
      .update({
        where: {
          id: orderId,
        },
        data: {
          status: dto.status,
        },
      })
      .catch(() => {
        throw new NotFoundException('Cart not found');
      });
  }
}
