import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {MARKET_PARTS, MarketService} from '../../services/market.service';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {SecureStorageService} from '../../services/secure-storage.service';

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

export interface IMarketPart {
    part: number;
    isChecked: boolean;
}

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
    public contacts: IContacts[] = [];
    public markets: IMarket[] = [];
    public marletParts: IMarketPart[];
    public allParts = true;

    constructor(private apiService: ApiService,
                private marketService: MarketService,
                private router: Router,
                private secureStorageService: SecureStorageService,
                private alertController: AlertController) {
        this.marletParts = MARKET_PARTS.map((part) => {
            const isChecked = true;

            return {part, isChecked};
        });
    }

    ngOnInit() {
        this.getMarkets();
    }

    async showLogOutAlert() {
        const alert = await this.alertController.create({
            header: 'Вы действительно хотите выйти?',
            buttons: [
                {
                    text: 'Нет'
                },
                {
                    text: 'Да',
                    handler: () => {
                        this.logOut();
                    }
                }
            ]
        });

        await alert.present();
    }

    public changeAll() {
        console.log(this.allParts);
        this.marletParts.forEach((part) => {
            part.isChecked = this.allParts;
        });
    }

    public changePart() {
        this.marketService.marketPartsArr = this.marletParts.map(({part}) => part);
    }

    private logOut(): void {
        this.secureStorageService.removeItemFromStorage('epic-token');
        this.router.navigate(['/authorization']);
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
