import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    uri = environment.url;
    // uri = 'http://localhost:8080/api';

    constructor(private http: HttpClient) {
    }

    login(data) {
        return this.http.post(`${this.uri}/login`, data);
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

    getFile(filename: string) {
        return this.http
            .get(
                `${this.uri}/infotable/file/${filename}`,
                {responseType: 'blob' as 'json'}
            )
            .pipe(map((res: Blob) => res));
    }
}
