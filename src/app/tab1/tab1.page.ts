import {Component, OnInit} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {ApiService} from '../services/api.service';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

export interface IInfoTable {
    beznal: string;
    date: string;
    delta: number;
    delta_year: number;
    dolya: number;
    fact: number;
    name: string;
    percent: number;
    up_date: string;
    nal: number;
    voz: number;
    per_beznal: number;
    per_voz: number;
    vipolnenie: number;
    plan: number;
    day_week?: string;
    day?: string;
    key_month?: string;
}

export interface IMainInfoTable {
    _id?: string;
    createDate?: Date;
    updateDate?: Date;
    day: IInfoTable[];
    month: IInfoTable[];
    month_closed_day: IInfoTable[];
}

export interface IDay {
    day: string;
    day_week: string;
}

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    public infoMarkets: IMainInfoTable[] = [];
    public isMonth = false;
    public daysArr = [];
    public filterPeriod = 'day'; // can be: "day", "month"
    public marketParts = 0; // 0 - all
    public currentData: IInfoTable[] = null;
    public filteredData: IInfoTable[] = null;
    public filterDay = null;

    private loading;

    constructor(
        private apiService: ApiService,
        private loadingController: LoadingController
    ) {
    }

    ngOnInit() {
        this.getInfoMarkets();
    }

    public segmentChanged(e) {
        console.log(e);
    }

    public changeMarketData() {

        switch (this.filterPeriod) {
            case 'day':
                this.updateMarketData('');
                break;
            case 'month':
                this.updateMarketData('_m');
                break;
            default:
                break;
        }
    }

    public doRefresh(event) {
        console.log('Begin async operation');
        this.getInfoMarkets(event.target);

        // setTimeout(() => {
        //     console.log('Async operation has ended');
        //     event.target.complete();
        // }, 2000);
    }

    public getWeekDay(curDay: string) {
        return this.currentData.filter(({day}) => day === curDay)[0].day_week;
    }

    async presentLoading() {
        this.loading = await this.loadingController.create();
        await this.loading.present();
    }

    async dismissLoading() {
        return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }

    private updateMarketData(prefix: string) {
        const data = this.infoMarkets[0];

        if (this.marketParts > 0) {
            console.log(`${this.marketParts}${prefix}`);
            this.currentData = data[`${this.marketParts}${prefix}`];
        } else {
            if (prefix === '_m') {
                console.log('month');
                this.currentData = data.month;
                this.setDaysArray();
            } else {
                console.log('day');
                this.currentData = data.day;
                this.setDaysArray();
            }
        }

        this.updateFilteredDate();
    }

    private updateFilteredDate() {

        this.filteredData = this.currentData.filter((item) => {
            if (item.day) {
                return item.day === this.filterDay;
            }
            if (item.key_month) {
                console.log(item.key_month === this.filterDay, item.key_month, this.filterDay);
                return item.key_month === this.filterDay;
            }
        });
    }

    async getInfoMarkets(refresh?: any) {
        let loading;

        if (!refresh) {
            loading = await this.loadingController.create();
            await loading.present();
        }

        this.apiService
            .getInfoMarkets()
            .subscribe((data: IMainInfoTable[]) => {
                this.infoMarkets = data;
                this.currentData = this.infoMarkets[0].day;
                console.log('Data infoMarkets requested ...');
                console.log(this.infoMarkets);

                this.setDaysArray();

                if (refresh) {
                    refresh.complete();
                } else {
                    loading.dismiss();
                }
            });
    }

    private setDaysArray() {
        const allDaysArr = [];

        this.currentData.forEach((item) => {
            if (item.day) {
                allDaysArr.push(item.day);
            }
            if (item.key_month) {
                allDaysArr.push(item.key_month);
            }
        });

        this.daysArr = [...Array.from(new Set(allDaysArr))].sort((a, b) => (a - b));
        this.filterDay = this.daysArr[0];
    }
}
