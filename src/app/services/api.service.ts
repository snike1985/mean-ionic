import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    // uri = environment.url;
    uri = 'http://localhost:8080/api';

    constructor(private http: HttpClient) {
    }

    getContacts() {
        return this.http.get(`${this.uri}/contacts`);
    }

    getMarkets() {
        return this.http.get(`${this.uri}/markets`);
    }

    getInfoMarkets() {
        return this.http.get(`${this.uri}/infotable`);
    }
}
