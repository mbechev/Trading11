import { ClientPanelComponent } from './../client-panel/client-panel.component';
import { ClientListComponent } from './client-list/client-list.component';
import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagerPanelComponent } from './manager-panel.component';


const routes = [
    { path: '', component: ManagerPanelComponent, },
    { path: 'clients', component: ClientListComponent },
    { path: 'client', component: ClientPanelComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManagerRoutingModule { }
