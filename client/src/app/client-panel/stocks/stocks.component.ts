import { AppConfig } from './../../config/app.config';
import { FundsService } from './../../core/fund.service';
import { Component, Injectable, OnInit, } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalComponent } from './modal/modal.component';
import { NotificationService } from 'src/app/core/notification.service';
import { ModalDTO } from 'src/app/models/modal.dto';
import { OrdersService } from 'src/app/core/order.service';
import { ClientSidebarComponent } from '../sidebar/client-sidebar.component';
@Injectable()
@Component({
    providers: [ClientSidebarComponent],
    selector: 'app-stocks',
    templateUrl: './stocks.component.html',
})
export class StocksComponent implements OnInit {
    public stockGrid;
    private columnDefs = [
        { headerName: 'Symbol', field: 'symbol' },
        { headerName: 'Market', field: 'market' },
        { headerName: 'Sell Price ($)', field: 'sellprice' },
        { headerName: 'Buy Price ($)', field: 'buyprice' }
    ];

    constructor(
        private dialog: MatDialog,
        private notification: NotificationService,
        private fundsService: FundsService,
        private orderService: OrdersService,
        private appConfig: AppConfig,
        private clientSidebar: ClientSidebarComponent,
    ) { }
    ngOnInit() {
        this.stockGrid = this.appConfig.stockGrid;
    }
    displayModal(event) {
        const instrument = `${event.data.symbol} (${event.data.market})`;
        const refDial = this.dialog.open(ModalComponent,
            {
                data: {
                    name: instrument,
                    buyprice: +event.data.buyprice,
                    sellprice: +event.data.sellprice
                }
            });
        refDial.afterClosed().subscribe((result: ModalDTO) => {
            if (isNaN(result.total) || +result.units === 0) {
                this.notification.openSnackBar('Invalid unit or price', 'OK', 'red');
            } else {
                this.orderService.saveOrder(result, event.data.symbol);
                this.fundsService.substractFund(result);
                setTimeout(() => {
                    this.clientSidebar.updateBalance();
                }, 1500);
            }
        });
    }
}
