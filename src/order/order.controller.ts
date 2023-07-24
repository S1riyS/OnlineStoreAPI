import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateOrderResponse, GetOrderResponse } from './types';
import { ApiError } from '../common/types';
import { NotFoundInterceptor } from '../common/interceptors';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates new order' })
  @ApiCreatedResponse({ type: CreateOrderResponse })
  @ApiNotFoundResponse({ description: 'Cart not found', type: ApiError })
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('Order not found'))
  @ApiOperation({ summary: 'Returns order with given ID' })
  @ApiOkResponse({ type: GetOrderResponse })
  @ApiNotFoundResponse({ description: 'Order not found', type: ApiError })
  getOne(@Param('id', ParseIntPipe) orderId: number) {
    return this.orderService.getOne(orderId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates status of the order' })
  @ApiOkResponse({ description: 'Status is updated successfully' })
  @ApiNotFoundResponse({ description: 'Order not found', type: ApiError })
  updateStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(orderId, dto);
  }
}
