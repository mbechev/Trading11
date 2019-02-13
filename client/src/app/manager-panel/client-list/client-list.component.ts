import { Component, Injectable, OnInit, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { UserInfoDTO } from 'src/app/models/userInfo.dto';
import { UsersHttpService } from 'src/app/core/user.http.service';
import { NotificationService } from 'src/app/core/notification.service';

@Injectable()
@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
    private clientsData = []; /* [ [Martin, 500], [Ivan, 50000 ] ]*/
    @Input() private showClients: boolean;
    constructor(
        private usersHttpService: UsersHttpService,
        private router: Router,
        private notificationService: NotificationService

    ) { }
    ngOnInit(): void {
        this.clientsData = this.getClients();
    }

    clientOverview(data) {
        this.setClientCred(data[1]).subscribe(() => {

            this.router.navigate(['/client/portfolio']);
        });
    }

    searchClient() {
        let input, filter, table, tr, td, i, txtValue;
        input = document.getElementById('myInput');
        filter = input.value.toUpperCase();
        table = document.getElementById('myTable');
        tr = table.getElementsByTagName('tr');
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName('td')[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = '';
                } else {
                    tr[i].style.display = 'none';
                }
            }
        }
    }

    setClientCred(email): Observable<any> {

        return Observable.create((observer: Observer<any>) => {

            this.usersHttpService.retrieveUserData({ email }).subscribe(
                (clientData: UserInfoDTO) => {
                    localStorage.setItem('client_name', clientData.fullname);
                    localStorage.setItem('client_email', clientData.email);
                    localStorage.setItem('client_id', clientData.id);
                    observer.next(null);
                }
            );
        });
    }
    getClients() {
        const clientData = [];
        const managerID = { id: localStorage.getItem('manager_id') };
        this.usersHttpService.retrieveClientsData(managerID).subscribe(
            (clients: []) => {
                clients.forEach((client: UserInfoDTO) => {
                    const info = [];
                    info.push(client.fullname, client.email, +client.funds.currentamount);
                    clientData.push(info);
                });
            },
            (e) => {
                return this.notificationService.openSnackBar('No clients to show', 'Ok', 'red');
            }
        );
        return clientData;
    }
}
