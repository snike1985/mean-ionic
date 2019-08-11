import {Component, OnInit} from '@angular/core';
import {Idea, IdeaService} from '../services/firenbase-data.service';
import {Observable} from 'rxjs';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {Platform} from '@ionic/angular';

import * as firebase from 'firebase';

import {MimeService} from '../services/mime.service';
import {ApiService} from '../services/api.service';

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

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    public contacts: IContacts[] = [];

    private ideas: Observable<Idea[]>;
    private curMime = '';

    constructor(
        private ideaService: IdeaService,
        private apiService: ApiService,
        private mime: MimeService,
        private file: File,
        private fileTransfer: FileTransfer,
        private fileOpener: FileOpener,
        private platform: Platform
    ) {
    }

    ngOnInit() {
        this.ideas = this.ideaService.getIdeas();
        this.getContacts();
    }

    public getSomeText(path: string) {
        this.curMime = this.mime.getMIMEtype(path.split('.').pop());
        firebase.storage().ref().child(path).getDownloadURL()
            .then(response => {
                console.log(response);
                this.openDocument(response);
            })
            .catch(error => console.log('error', error));
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

    private openDocument(doc: string): void {
        const transfer = this.fileTransfer.create();
        let path = null;

        if (this.platform.is('ios')) {
            path = this.file.documentsDirectory;
        } else {
            path = this.file.dataDirectory;
        }

        console.log('mimeType', this.curMime);
        console.log(doc, path + doc.split('/').pop());

        transfer
            .download(doc, path + doc.split('/').pop())
            .then(
                (entry) => {
                    const url = entry.toURL();


                    this.fileOpener.open(url, this.curMime)
                        .then(() => {
                            console.log('File is opened');
                        })
                        .catch((err) => console.error(err));
                },
                () => {
                }
            );
    }
}
