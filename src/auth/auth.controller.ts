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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiError } from '../common/types';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registration of new user' })
  @ApiCreatedResponse({ type: TokensType })
  @ApiBadRequestResponse({
    description: 'Email is already used or invalid input data',
    type: ApiError,
  })
  signupLocal(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in to the system' })
  @ApiOkResponse({ type: TokensType })
  @ApiBadRequestResponse({
    description: 'Invalid username/password supplied or invalid input data',
    type: ApiError,
  })
  loginLocal(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.loginLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Current user logout' })
  @ApiOkResponse({ description: 'Logged out successfully' })
  @ApiUnauthorizedResponse({
    description: 'User is unauthorized',
    type: ApiError,
  })
  @ApiBearerAuth('JWT-auth')
  logout(@CurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @ApiOperation({ summary: 'Returns new access and refresh tokens' })
  @ApiOkResponse({ type: TokensType })
  @ApiUnauthorizedResponse({
    description: 'User is unauthorized',
    type: ApiError,
  })
  @ApiBearerAuth('JWT-refresh')
  refresh(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(userId, refreshToken);
  }
}
