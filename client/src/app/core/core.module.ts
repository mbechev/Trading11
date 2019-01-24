import { UsersHttpService } from './user.http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { AppConfig } from '../config/app.config';
import { UsersService } from './user.service';
import { StocksService } from './stocks.service';
import { NotificationService } from './notification.service';

@NgModule({
  imports: [],
  providers: [
    AppConfig,
    AuthService,
    JwtHelperService,
    UsersService,
    UsersHttpService,
    NotificationService,
    StocksService,
  ]
})
export class CoreModule { }
