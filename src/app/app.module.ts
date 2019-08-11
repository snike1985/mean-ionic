import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFirestoreModule, FirestoreSettingsToken} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {MimeService} from './services/mime.service';
import {ReviewsService} from './services/reviews.service';
import {ApiService} from './services/api.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Platform,
        MimeService,
        FileTransfer,
        File,
        FileOpener,
        ReviewsService,
        ApiService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: FirestoreSettingsToken, useValue: {}}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
