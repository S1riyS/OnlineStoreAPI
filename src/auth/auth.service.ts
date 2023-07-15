import { Injectable } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  loginLocal(dto: LoginDto) {
    return 'logged in ' + dto.email;
  }

  signupLocal(dto: SignupDto) {
    return 'signed up ' + dto.email;
  }

  logout() {
    return 0;
  }

  refresh() {
    return 0;
  }
}
