import {AfterViewInit, Component, OnInit} from '@angular/core';
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
export class SettingsPage implements OnInit, AfterViewInit {
    public contacts: IContacts[] = [];
    public markets: IMarket[] = [];
    public marketParts: IMarketPart[];
    public allParts = true;

    private defaultPart: string;

    constructor(private apiService: ApiService,
                private marketService: MarketService,
                private router: Router,
                private secureStorageService: SecureStorageService,
                private alertController: AlertController) {
    }

    ngOnInit() {
        // this.getMarkets();
        // const defaultPart = this.secureStorageService.defaultPart;
        //
        // this.defaultPart = this.secureStorageService.defaultPart ? defaultPart : this.marketService.marketPartsArr[0].toString();
        // this.marketParts = this.marketService.marketPartsArr.map((part) => {
        //     const isChecked: boolean = part.toString() === this.defaultPart;
        //
        //     return {part, isChecked};
        // });
    }

    ngAfterViewInit() {
        const defaultPart = this.secureStorageService.defaultPart;

        this.defaultPart = this.secureStorageService.defaultPart ? defaultPart : this.marketService.marketPartsArr[0].toString();
        this.marketParts = this.marketService.marketPartsArr.map((part) => {
            const isChecked: boolean = part.toString() === this.defaultPart;

            return {part, isChecked};
        });
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

    public getPartTitle(part: number): string {

        switch (part) {
            case 1000:
                return 'Доставка';
                break;
            case 0:
                return 'Все отделы';
                break;
            default:
                return part.toString();
                break;
        }
    }

    public changeAll() {
        console.log(this.allParts);
        // this.marketParts.forEach((part) => {
        //     part.isChecked = this.allParts;
        // });
    }

    public changePart(e) {
        console.log(e.detail.value);
        const newDefaultPart = e.detail.value;

        this.secureStorageService.setDefaultPartToStorage(newDefaultPart);
        // this.marketService.marketPartsArr = this.marketParts.map(({part}) => part);
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
