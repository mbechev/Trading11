import { Injectable } from '@angular/core';
import { AppConfig } from '../config/app.config';
import { HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { IdDTO } from '../models/id.dto';

@Injectable()
export class UsersHttpService {
    constructor(
        private httpClient: HttpClient,
        private appConfig: AppConfig,
    ) { }

    public retrieveUserData(userEmail): Observable<object> {
        return this.httpClient.post(`${this.appConfig.apiUrl}/users/user`, userEmail);
    }
    public retrieveManagerData(userEmail): Observable<object> {
        return this.httpClient.post(`${this.appConfig.apiUrl}/users/manager`, userEmail);
    }

    public retrieveClientsData(id: IdDTO): Observable<object> {
        return this.httpClient.post(`${this.appConfig.apiUrl}/users/client`, id);
    }
}
