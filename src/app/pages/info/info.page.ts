import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {MarketService} from '../../services/market.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Subscription} from 'rxjs';
import {ImageComponent} from '../../modals/image/image.component';

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
    selector: 'app-info',
    templateUrl: 'info.page.html',
    styleUrls: ['info.page.scss']
})
export class InfoPage implements AfterViewInit, OnDestroy {
    public infoMarkets: IMainInfoTable[] = [];
    public isMonth = false;
    public daysArr = [];
    public filterPeriod = 'day'; // can be: "day", "month"
    public marketPartsArr = [];
    public marketParts = 0; // 0 - all
    public currentData: IInfoTable[] = null;
    public filteredData: IInfoTable[] = null;
    public filterDay = null;
    public viewType = 'main';
    public isLandscape = false;
    public imagePath = '';

    private loading;
    private getFileImageRequest: Subscription;
    private oldPrefix: string = null;

    constructor(private apiService: ApiService,
                private loadingController: LoadingController,
                private marketService: MarketService,
                private screenOrientation: ScreenOrientation,
                private webview: WebView,
                private modalController: ModalController) {
        this.marketPartsArr = this.marketService.marketPartsArr;
        this.marketParts = this.marketPartsArr[0];
        console.log('this.marketPartsArr', this.marketPartsArr);
    }

    ngAfterViewInit() {
        this.getInfoMarkets();
        this.screenOrientation.onChange().subscribe(() => this.changeDeviceOrientation());
    }

    ngOnDestroy() {
        this.getFileImageRequest.unsubscribe();
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
    }

    public getWeekDay(curDay: string) {
        return this.currentData.filter(({day}) => day === curDay)[0].day_week;
    }

    public getDate(date: string): Date {
        return new Date(date);
    }

    public getMarketPartName(key: number): string {
        if (key === 1000) {
            return 'Доставка';
        } else {
            return key.toString();
        }
    }

    async presentLoading() {
        this.loading = await this.loadingController.create();
        await this.loading.present();
    }

    async dismissImageModal() {
        return await this.modalController.dismiss().then(() => console.log('dismissImageModal'));
    }

    async dismissLoading() {
        return await this.loadingController.dismiss().then(() => console.log('dismissLoading'));
    }

    async changeDeviceOrientation() {
        const landscapeSecondary = 'landscape-secondary';
        // const landscapePrimary = 'landscape-primary';

        console.log('changeDeviceOrientation:', this.screenOrientation.type);

        if (this.screenOrientation.type === landscapeSecondary) {
            await this.getImage();
        } else {
            this.getFileImageRequest.unsubscribe();
            this.isLandscape = false;
            await this.dismissLoading();
            // await this.dismissImageModal();
        }
    }

    async getImage() {
        await this.presentLoading();

        console.log('filterDay:', this.filterDay);
        const filename = `${this.prepareFileName(this.filterDay.toString().trim())}.gif`;

        this.getFileImageRequest = this.apiService.getFile(filename).subscribe(
            (res) => {
                this.dismissLoading();
                const url = window.URL.createObjectURL(res);
                this.imagePath = this.webview.convertFileSrc(url);
                this.isLandscape = true;
                this.presentModal();
                // this.imagePath = url;
            },
            () => {
                this.imagePath = '';
                this.dismissLoading();
            }
        );
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: ImageComponent,
            componentProps: {
                imagePath: this.imagePath
            }
        });
        return await modal.present();
    }

    private prepareFileName(name: string): string {
        return name
            .replace('янв', 'jan')
            .replace('фев', 'feb')
            .replace('мар', 'mar')
            .replace('апр', 'apr')
            .replace('май', 'may')
            .replace('июн', 'jun')
            .replace('июл', 'jul')
            .replace('авг', 'aug')
            .replace('сен', 'sep')
            .replace('окт', 'oct')
            .replace('ноя', 'nov')
            .replace('дек', 'dec');
    }

    private updateMarketData(prefix: string) {
        const data = this.infoMarkets[0];

        console.log('this.marketParts', this.marketParts);

        if (this.marketParts > 0) {
            if (Number(this.marketParts) === 1000) {
                this.currentData = data[`dost${prefix}`];
            } else {
                this.currentData = data[`${this.marketParts}${prefix}`];
            }
        } else {
            if (prefix === '_m') {
                console.log('month');
                this.currentData = data.month;
            } else {
                console.log('day');
                this.currentData = data.day;
            }
        }

        if (this.oldPrefix !== prefix) {
            this.setDaysArray();
            this.oldPrefix = prefix;
        }

        this.updateFilteredDate();
        // this.getImage();
    }

    private updateFilteredDate() {
        this.filteredData = this.currentData.filter((item) => {
            if (item.day) {
                return item.day === this.filterDay;
            }
            if (item.key_month) {
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
            .subscribe(
                (data: IMainInfoTable[]) => {
                    this.infoMarkets = data;
                    this.marketService.setMarketParts(Object.keys(this.infoMarkets[0]));
                    this.marketPartsArr = this.marketService.marketPartsArr;
                    this.currentData = this.infoMarkets[0][this.marketPartsArr[0] + ''];
                    this.marketParts = this.marketPartsArr[0];
                    console.log('this.currentData', this.currentData);
                    this.changeMarketData();

                    if (refresh) {
                        refresh.complete();
                    } else {
                        loading.dismiss();
                    }

                    console.log('Data infoMarkets requested ...');
                    console.log(this.infoMarkets);
                },
                () => {
                    if (refresh) {
                        refresh.complete();
                    } else {
                        loading.dismiss();
                    }
                });
    }

    private setDaysArray() {
        const allDaysArr = [];

        console.log('this.currentData', this.currentData);

        this.currentData.forEach((item) => {
            if (item.day) {
                allDaysArr.push(item.day);
            }
            if (item.key_month) {
                allDaysArr.push(item.key_month);
            }
        });

        this.daysArr = [...Array.from(new Set(allDaysArr))];
        if (this.filterPeriod === 'month') {
            this.filterDay = this.daysArr[1];
        } else {
            this.filterDay = this.daysArr[0];
        }
    }
}
