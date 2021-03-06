import { CloseOrderDTO } from './../../models/close-order.dto';
import { AppConfig } from 'src/app/config/app.config';
import { Component, Injectable, OnInit, } from '@angular/core';
import { GridOptions, } from 'ag-grid-community';
import { MatDialog } from '@angular/material';
import { OrdersService } from 'src/app/core/order.service';
import { ClosePosModalComponent } from './close-position-modal/close-pos.modal.component';

@Injectable()
@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
    private frameworkComponents;
    private portfolioGrid: string;
    public gridOptions: GridOptions;
    private columnDefs = [
        { headerName: 'Order id', field: 'id', width: 80 },
        { headerName: 'Symbol', field: 'symbol' },
        { headerName: 'Direction', field: 'direction' },
        { headerName: 'Units', field: 'units' },
        { headerName: 'Price ($)', field: 'price' },
        { headerName: 'Date', field: 'date' },
    ];

    constructor(
        public dialog: MatDialog,
        private orderService: OrdersService,
        private appConfig: AppConfig,
    ) { }
    ngOnInit() {
        this.portfolioGrid = this.appConfig.portfolioGrid;
    }

    closePosition(event) {
        const instrument = `${event.data.symbol}`;
        const dialogRef = this.dialog.open(ClosePosModalComponent,
            {
                data: {
                    name: instrument,
                }
            });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                const orderBody: CloseOrderDTO = {
                    direction: event.data.direction,
                    price: event.data.price,
                    units: event.data.units,
                    companyId: '',
                    closePrice: '',
                    id: event.data.id,
                };
                this.orderService.closeOrder(orderBody, event.data.symbol);
            }
        });
    }
}

