import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InfoPage} from './info.page';
import {ImageModule} from '../../modals/image/image.module';
import {ImageComponent} from '../../modals/image/image.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ImageModule,
        RouterModule.forChild([{path: '', component: InfoPage}])
    ],
    entryComponents: [ImageComponent],
    declarations: [InfoPage]
})
export class InfoPageModule {
}
