import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { Tokens } from './types';
import { Request } from 'express';
import { AtGuard, RtGuard } from './common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: SignupDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  loginLocal(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.loginLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user;
    return this.authService.logout(user['sub']);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request) {
    const user = req.user;
    return this.authService.refresh(user['sub'], user['refreshToken']);
  }
}
