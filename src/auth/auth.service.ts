import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto';
import { hashData } from '../common/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signupLocal(dto: CreateUserDto): Promise<Tokens> {
    const candidate = await this.userService.getOneByEmail(dto.email);

    if (candidate) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = await this.userService.create(dto);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async loginLocal(dto: LoginDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Incorrect email or password');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Incorrect email or password');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refresh(userId: number, rt: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await hashData(rt);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const accessToken = this.jwtService.signAsync(
      {
        sub: userId,
        email: email,
      },
      {
        secret: 'AT-STRATEGY-SECRET-KEY',
        expiresIn: 60 * 15,
      },
    );

    const refreshToken = this.jwtService.signAsync(
      {
        sub: userId,
        email: email,
      },
      {
        secret: 'RT-STRATEGY-SECRET-KEY',
        expiresIn: 60 * 60 * 24 * 7,
      },
    );

    const [at, rt] = await Promise.all([accessToken, refreshToken]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
