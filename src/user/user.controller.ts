import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AtGuard } from '../common/guards';
import { CurrentUserId } from '../common/decorators';
import { ApiError } from '../common/types';
import { NotFoundInterceptor } from '../common/interceptors';
import { EditUserDto } from './dto';
import { EditUserResponse, GetUserResponse } from './types';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: GetUserResponse })
  @ApiUnauthorizedResponse({
    description: 'User is unauthorized',
    type: ApiError,
  })
  @ApiNotFoundResponse({ description: 'User was not found', type: ApiError })
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  getMe(@CurrentUserId() userId: number) {
    return this.userService.getOneById(userId);
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  @ApiOperation({ summary: 'Get current user by ID' })
  @ApiOkResponse({ type: GetUserResponse })
  @ApiNotFoundResponse({ description: 'User was not found', type: ApiError })
  getOne(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getOneById(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [GetUserResponse] })
  getAll() {
    return this.userService.getAll();
  }

  @Put('me')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Edit current user' })
  @ApiOkResponse({ type: EditUserResponse })
  @ApiUnauthorizedResponse({
    description: 'User is unauthorized',
    type: ApiError,
  })
  @ApiBearerAuth('JWT-auth')
  editUser(@CurrentUserId() userId: number, @Body() dto: EditUserDto) {
    return this.userService.edit(userId, dto);
  }
}
