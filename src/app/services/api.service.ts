import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  uri = environment.url;

  constructor(private http: HttpClient) { }

  getContacts() {
    return this.http.get(`${this.uri}/contacts`);
  }
}
