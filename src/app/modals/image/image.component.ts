import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
    public imagePath = '';

    constructor(private navParams: NavParams,
                private screenOrientation: ScreenOrientation,
                private modalCtrl: ModalController) {
        this.imagePath = this.navParams.get('imagePath');
        console.log(this.imagePath);
    }

    ngOnInit() {
        this.screenOrientation.onChange().subscribe(() => this.changeDeviceOrientation());
    }

    async changeDeviceOrientation() {
        const landscapeSecondary = 'landscape-secondary';
        // const landscapePrimary = 'landscape-primary';

        console.log('changeDeviceOrientation:', this.screenOrientation.type);

        if (this.screenOrientation.type !== landscapeSecondary) {
            this.modalCtrl.dismiss();
        }
    }
}
