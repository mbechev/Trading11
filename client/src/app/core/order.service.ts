import { UsersHttpService } from './user.http.service';
import { StockDTO } from './../models/stock.dto';
import { FundsService } from './fund.service';
import { ModalDTO } from 'src/app/models/modal.dto';
import { CompanyDTO } from './../models/company.dto';
import { StocksService } from './stocks.service';
import { NotificationService } from './notification.service';
import { Injectable } from '@angular/core';
import { CreateOrderDTO } from '../models/create-order.dto';
import { OrdersHttpService } from './order.http.service';
import { UserInfoDTO } from '../models/userInfo.dto';
import { CloseOrderDTO } from '../models/close-order.dto';
import { take } from 'rxjs/operators';

@Injectable()
export class OrdersService {
    constructor(
        private notificationService: NotificationService,
        private orderHttpService: OrdersHttpService,
        private stockService: StocksService,
        private fundsService: FundsService,
        private usersHttpService: UsersHttpService,
    ) { }
    saveOrder(result: ModalDTO, companyAbbr) {
        this.stockService.retrieveCompanyInfo({ abbr: companyAbbr }).subscribe((companyInfo: CompanyDTO) => {
            const order: CreateOrderDTO = {
                openPrice: result.price,
                units: result.units,
                clientEmail: localStorage.getItem('client_email'),
                companyId: companyInfo.id,
                direction: result.direction
            };

            this.usersHttpService.retrieveUserData({ email: localStorage.getItem('client_email') }).subscribe(
                (response: UserInfoDTO) => {
                    if (response.funds.currentamount > result.total) {
                        this.orderHttpService.createOrder(order).subscribe();
                    }
                }
            );
        });
    }

    closeOrder(orderBody: CloseOrderDTO, abbr) {
        this.stockService.retrieveCompanyInfo({ abbr }).subscribe((company: CompanyDTO) => {
            orderBody.companyId = company.id;
            this.stockService.getLastPrices({ id: company.id }).subscribe((prices: StockDTO) => {
                orderBody.closePrice = prices.startprice;
                this.orderHttpService.closeOrder(orderBody).subscribe((updatedOrder: any) => {
                    this.fundsService
                        .changeBalance({ email: localStorage.getItem('client_email'), amount: updatedOrder.result });
                        // window.location.reload();
                });
            });
        });
        this.notificationService.openSnackBar('Position closed', 'OK', 'green');
    }
}
