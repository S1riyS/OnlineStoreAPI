import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto';
import { hashData } from '../common/utils';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getOneById(userId: number): Promise<User> {
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

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashData(dto.password);
    return this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
  }

  async edit() {
    console.log(0);
  }
}
