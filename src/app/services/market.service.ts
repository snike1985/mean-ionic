import {Injectable} from '@angular/core';

export const MARKET_PARTS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 310, 800, 1000]; // 1000 - dost

@Injectable({
    providedIn: 'root'
})
export class MarketService {
    public marketPartsArr = MARKET_PARTS;

    constructor() {
    }

    public setMarketParts(data: string[]) {
        this.marketPartsArr = [];

        data.forEach((key) => {
            switch (key) {
                case 'day':
                    this.marketPartsArr.push(0);
                    break;
                case '10':
                    this.marketPartsArr.push(10);
                    break;
                case '20':
                    this.marketPartsArr.push(20);
                    break;
                case '30':
                    this.marketPartsArr.push(30);
                    break;
                case '40':
                    this.marketPartsArr.push(40);
                    break;
                case '50':
                    this.marketPartsArr.push(50);
                    break;
                case '60':
                    this.marketPartsArr.push(60);
                    break;
                case '70':
                    this.marketPartsArr.push(70);
                    break;
                case '80':
                    this.marketPartsArr.push(80);
                    break;
                case '90':
                    this.marketPartsArr.push(90);
                    break;
                case '100':
                    this.marketPartsArr.push(100);
                    break;
                case '310':
                    this.marketPartsArr.push(310);
                    break;
                case '800':
                    this.marketPartsArr.push(800);
                    break;
                case 'dost':
                    this.marketPartsArr.push(1000);
                    break;
            }
        });

        this.marketPartsArr.sort((a, b) => a - b);
        console.log(this.marketPartsArr);
    }
}
