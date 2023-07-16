import { Injectable } from '@nestjs/common';
import { exclude, PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, EditUserDto } from './dto';
import { hashData } from '../common/utils';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getOneById(userId: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: exclude('user', ['password', 'hashedRt']),
    });
  }

  async getOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      select: exclude('user', ['password', 'hashedRt']),
    });
  }

  async getAll() {
    return this.prismaService.user.findMany({
      select: exclude('user', ['password', 'hashedRt']),
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
      select: exclude('user', ['password', 'hashedRt']),
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
      select: exclude('user', ['password', 'hashedRt']),
    });
  }
}
