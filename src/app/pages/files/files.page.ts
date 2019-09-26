import {Component} from '@angular/core';
import {LoadingController, Platform} from '@ionic/angular';

import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';

import {MimeService} from '../../services/mime.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-files',
    templateUrl: 'files.page.html',
    styleUrls: ['files.page.scss']
})
export class FilesPage {
    public url = environment.url;
    private curMime = '';

    constructor(private mime: MimeService,
                private file: File,
                private fileTransfer: FileTransfer,
                private fileOpener: FileOpener,
                private platform: Platform,
                private loadingController: LoadingController) {
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

        this.presentLoading();

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
                    let url: string;

                    if (this.platform.is('ios')) {
                        url = entry.toURL();
                    } else {
                        url = entry.toInternalURL();
                    }

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
