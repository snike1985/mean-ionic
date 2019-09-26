import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';

import {AuthorizationPage} from './authorization.page';


@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: AuthorizationPage}])
    ],
    declarations: [AuthorizationPage]
})
export class AuthorizationPageModule {
}
