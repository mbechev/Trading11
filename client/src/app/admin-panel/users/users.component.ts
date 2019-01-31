import { AdminPanelUsersService } from './../../core/users.service';
import { Component, OnInit, ViewChild, HostListener, HostBinding, Input, DoCheck } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/config/app.config';
import { UsersManageModel } from 'src/app/models/users-manage.model';
import { UpdateUsers } from 'src/app/core/users-update.service';

@Component({
  selector: 'app-admin-panel-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['role', 'name', 'email', 'manager', 'funds'];
  dataSource: MatTableDataSource<UsersManageModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: AdminPanelUsersService,
    ) {  }

  async ngOnInit() {
    await this.fillTable();
  }

  public async fillTable() {
    const users = await this.usersService.getClients();
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
