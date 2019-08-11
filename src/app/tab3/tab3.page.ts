import {Component} from '@angular/core';
import {LoadingController, Platform} from '@ionic/angular';

import * as firebase from 'firebase';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';

import {MimeService} from '../services/mime.service';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    public url = environment.url;
    private curMime = '';

    constructor(
        private mime: MimeService,
        private file: File,
        private fileTransfer: FileTransfer,
        private fileOpener: FileOpener,
        private platform: Platform,
        private loadingController: LoadingController
    ) {
        // firebase.initializeApp(environment.firebase);
    }

    public getSomeText(path: string) {
        this.presentLoading();

        this.curMime = this.mime.getMIMEtype(path.split('.').pop());

        firebase.storage().ref().child(path).getDownloadURL()
            .then(response => {
                this.openDocument(response);
            })
            .catch(error => {
                console.log('error', error);
                this.dismissLoading();
            });
    }

    async presentLoading() {
        const loading = await this.loadingController.create();
        await loading.present();
    }

    async dismissLoading() {
        await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }

    private openDocument(doc: string): void {
        const transfer = this.fileTransfer.create();
        let path = null;

        if (this.platform.is('ios')) {
            path = this.file.documentsDirectory;
        } else {
            path = this.file.dataDirectory;
        }

        console.log(doc);
        console.log(path + doc.split('/').pop());

        if (!path) {
            this.dismissLoading();
        }

        transfer
            .download(doc, path + doc.split('/').pop())
            .then(
                (entry) => {
                    const url = entry.toURL();

                    this.dismissLoading();

                    this.fileOpener.open(url, this.curMime)
                        .then(() => {
                            console.log('File is opened');
                        })
                        .catch((err) => console.error(err));
                },
                () => {
                    this.dismissLoading();
                }
            )
            .catch((err) => {
                console.log(err);
            });
    }
}
