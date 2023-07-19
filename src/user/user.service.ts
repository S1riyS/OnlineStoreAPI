import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, EditUserDto } from './dto';
import { hashData } from '../common/utils';
import { Prisma } from '@prisma/client';

const userSelectObject: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getOneById(userId: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: userSelectObject,
    });
  }

  async getOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      select: userSelectObject,
    });
  }

  async getAll() {
    return this.prismaService.user.findMany({
      select: userSelectObject,
    });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await hashData(dto.password);
    return this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: userSelectObject,
    });
  }

  async edit(userId: number, dto: EditUserDto) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
      select: userSelectObject,
    });
  }
}
