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
import { User } from '@prisma/client';
import { EditUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AtGuard)
  @Get('me')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  getMe(@CurrentUserId() userId: number): Promise<User> {
    return this.userService.getOneById(userId);
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  getOne(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    return this.userService.getOneById(userId);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @UseGuards(AtGuard)
  @Put('me')
  editUser(@CurrentUserId() userId: number, @Body() dto: EditUserDto) {
    console.log(0);
  }
}
