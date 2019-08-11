import {Component, OnInit} from '@angular/core';
import {IMarketInterface, IncomesService} from '../services/incomes.service';
import {Observable} from 'rxjs';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    private incomes: Observable<IMarketInterface[]>;
    public dateUpdate = new Date();

    constructor(
        private incomesService: IncomesService,
        private loadingController: LoadingController
    ) {
    }

    ngOnInit() {
        this.incomes = this.incomesService.getIncomes();

        console.log(this.incomes);
    }

    public doRefresh(event) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

    async presentLoading() {
        const loading = await this.loadingController.create();
        await loading.present();
    }

    async dismissLoading() {
        await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }
}
