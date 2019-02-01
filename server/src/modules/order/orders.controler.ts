import { CloseOrderDTO } from 'src/models/order/close.order.dto';
import { Controller, Post, Body, BadRequestException, Get } from '@nestjs/common';
import { OrderService } from 'src/common/core/services/order.service';
import { OrderDTO } from 'src/models/order/order.dto';
import { IdDTO } from 'src/models/user/id.dto';
import { Result } from 'range-parser';

@Controller('order')
export class OrderController {
    constructor(private readonly ordersService: OrderService) { }

    @Post('/create')
    // @Roles('admin', 'manager')
    // @UseGuards(AuthGuard(), RolesGuard)
    createOrder(@Body() orderBody: OrderDTO) {
        try {
            this.ordersService.createOrder(orderBody);
        } catch (error) {
            throw new BadRequestException('Order failed!');
        }
    }
    @Post('/client')
    // @Roles('admin', 'manager')
    // @UseGuards(AuthGuard(), RolesGuard)
    gerOrdersByClient(@Body() id: IdDTO) {
        try {
            return this.ordersService.getOrdersByClient(id);
        } catch (error) {
            throw new BadRequestException('Can\'t close orders!');
        }
    }

    @Get('/all')
    // @Roles('admin', 'manager')
    // @UseGuards(AuthGuard(), RolesGuard)
    getAlll() {
        try {
            return this.ordersService.getOrdersAll();
        } catch (error) {
            throw new BadRequestException('Can\'t close orders!');
        }
    }

    @Post('/open')
    // @Roles('admin', 'manager')
    // @UseGuards(AuthGuard(), RolesGuard)
    getOpenPositions(@Body() id: string) {
        try {
            return this.ordersService.getOpenOrders(id);
        } catch (error) {
            throw new BadRequestException('No open orders found!');
        }
    }

    @Post('/delete')
    // @Roles('admin', 'manager')
    // @UseGuards(AuthGuard(), RolesGuard)
    closePositions(@Body() orderBody: CloseOrderDTO) {
        try {
            return this.ordersService.closeOrder(orderBody);
        } catch (error) {
            throw new BadRequestException('Can\'t close orders!');
        }
    }

    @Post('/close')
    // @Roles('admin', 'manager')
    // @UseGuards(AuthGuard(), RolesGuard)
    getClosed(@Body() id: IdDTO) {
        try {
            return this.ordersService.getClosedOrders(id);
        } catch (error) {
            throw new BadRequestException('Can\'t close orders!');
        }
    }
}
