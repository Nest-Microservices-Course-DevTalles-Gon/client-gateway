import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';

import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrdersStatusDto } from './dto';
import { OrdersPaginationDto } from './dto/orders-pagination.dto';
import { OrderStatus } from './enum/order.enum';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrdersPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // return this.ordersClient.send('findOneOrder', { id }).pipe(
    //   catchError(err => { throw new RpcException(err) })
    // )

    try {
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id })
      )

      return order
    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Get(':status')
  async findAllByStatus(
    @Param() orderStatus: OrdersStatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    return this.ordersClient.send(
      'findAllOrdersByStatus', {
      ...paginationDto,
      status: orderStatus.status
    })
      .pipe(catchError(err => { throw new RpcException(err) }))
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() orderStatusDto: OrdersStatusDto
  ) {
    return this.ordersClient.send('changeStatusOrders', {
      id,
      status: orderStatusDto.status
    })
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.;
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
