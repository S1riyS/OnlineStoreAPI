import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Tokens, TokensType } from './types';
import { AtGuard, RtGuard } from '../common/guards';
import { CurrentUser, CurrentUserId } from '../common/decorators';
import { CreateUserDto } from '../user/dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Registration of new user' })
  @ApiCreatedResponse({ type: TokensType })
  @ApiBadRequestResponse({
    description: 'Email is already used or invalid input data',
  })
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @ApiOperation({ summary: 'Log in to the system' })
  @ApiOkResponse({ type: TokensType })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Invalid username/password supplied or invalid input data',
  })
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  loginLocal(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.loginLocal(dto);
  }

  @ApiOperation({ summary: 'Current user logout' })
  @ApiOkResponse({ description: 'Logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'Refreshes access and refresh tokens' })
  @ApiOkResponse({ type: TokensType })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(userId, refreshToken);
  }
}
