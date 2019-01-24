import { ClientPanelComponent } from './../client-panel/client-panel.component';
import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StocksComponent } from '../client-panel/stocks/stocks.component';


const routes = [
    { path: '', component: ClientPanelComponent, },
    { path: 'stocks', component: StocksComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientRoutingModule { }