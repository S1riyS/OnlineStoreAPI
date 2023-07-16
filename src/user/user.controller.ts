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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: UserEntity })
  @ApiResponse({ status: 404, description: 'User was not found' })
  @UseGuards(AtGuard)
  @Get('me')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  getMe(@CurrentUserId() userId: number) {
    return this.userService.getOneById(userId);
  }

  @ApiOperation({ summary: 'Get current user by ID' })
  @ApiResponse({ status: 200, type: UserEntity })
  @ApiResponse({ status: 404, description: 'User was not found' })
  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  getOne(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getOneById(userId);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserEntity] })
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Edit current user' })
  @ApiResponse({ status: 200, type: UserEntity })
  @UseGuards(AtGuard)
  @Put('me')
  editUser(@CurrentUserId() userId: number, @Body() dto: EditUserDto) {
    return this.userService.edit(userId, dto);
  }
}
