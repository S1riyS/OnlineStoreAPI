import { Injectable } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async signupLocal(dto: SignupDto) {
    const hash = await this.hashData(dto.password);
    const newUser = this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    return 'signed up ' + dto.email;
  }

  loginLocal(dto: LoginDto) {
    return 'logged in ' + dto.email;
  }

  logout() {
    return 0;
  }

  refresh() {
    return 0;
  }
}
