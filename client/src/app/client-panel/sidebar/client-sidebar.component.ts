import { Component, Injectable, OnInit, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { UsersHttpService } from 'src/app/core/user.http.service';

@Injectable()
@Component({
    selector: 'app-client-sidebar',
    templateUrl: './client-sidebar.compoennt.html',
    styleUrls: ['./client-sidebar.component.css'],
})
export class ClientSidebarComponent implements OnInit {
    @Input() private clientName: string;

    constructor(
        private usersHttpService: UsersHttpService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.clientName = localStorage.getItem('client_name');
    }
    private showGrid() {
        this.router.navigate(['/client/stocks']);
    }
    private clear() {
        localStorage.removeItem('client_name');
    }
}
