import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto';

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

  async create(dto: CreateUserDto) {}

  async edit() {
    console.log(0);
  }
}
