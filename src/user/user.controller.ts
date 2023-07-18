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
import { AtGuard } from '../common/guards';
import { CurrentUserId } from '../common/decorators';
import { UserService } from './user.service';
import { NotFoundInterceptor } from '../common/interceptors';
import { EditUserDto } from './dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserEntity })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AtGuard)
  @Get('me')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  getMe(@CurrentUserId() userId: number) {
    return this.userService.getOneById(userId);
  }

  @ApiOperation({ summary: 'Get current user by ID' })
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  getOne(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getOneById(userId);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [UserEntity] })
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Edit current user' })
  @ApiOkResponse({ type: UserEntity })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AtGuard)
  @Put('me')
  editUser(@CurrentUserId() userId: number, @Body() dto: EditUserDto) {
    return this.userService.edit(userId, dto);
  }
}
