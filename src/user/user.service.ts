import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getOne(userId: number): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getAll() {
    const users = await this.prismaService.user.findMany();
    console.log(typeof users);
    return users;
  }

  async create() {
    console.log(0);
  }

  async edit() {
    console.log(0);
  }
}
