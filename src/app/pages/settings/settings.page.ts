import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

export interface IContacts {
    _id: string;
    name: string;
    email: string;
    phone: {
        mobile: string;
        work: string
    };
    createDate: Date;
}

export interface IMarket {
    _id: string;
    name: string;
    incomes: number;
    leftovers: number;
    period: string;
    createDate: Date;
}

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
    public contacts: IContacts[] = [];
    public markets: IMarket[] = [];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.getMarkets();
    }

    private getMarkets() {
        this.apiService
            .getMarkets()
            .subscribe((data: IMarket[]) => {
                this.markets = data;
                console.log('Data requested ...');
                console.log(this.markets);
            });
    }

    private getContacts() {
        this.apiService
            .getContacts()
            .subscribe((data: IContacts[]) => {
                this.contacts = data;
                console.log('Data requested ...');
                console.log(this.contacts);
            });
    }
}
