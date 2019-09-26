import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SecureStorageService} from './services/secure-storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private statusBar: StatusBar,
                private secureStorageService: SecureStorageService,
                private router: Router) {
        this.initializeApp();
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.getUserToken();
        });
    }

    private getUserToken(): void {
        this.secureStorageService
            .getTokenFromStorage()
            .subscribe(
                (token) => {
                    if (token) {
                        console.log('token', token);
                        this.router.navigate(['/tabs']);
                    } else {
                        console.log('need authorize');
                        this.router.navigate(['/authorization']);
                    }
                },
                () => {
                    console.log('error get token, need authorize');
                    this.router.navigate(['/authorization']);
                });
    }
}
