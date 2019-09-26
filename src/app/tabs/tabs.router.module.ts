import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'info',
                loadChildren: '../pages/info/info.module#InfoPageModule'
            },
            {
                path: 'files',
                loadChildren: '../pages/files/files.module#FilesPageModule'
            },
            {
                path: 'settings',
                loadChildren: '../pages/settings/settings.module#SettingsPageModule'
            },
            {
                path: '',
                redirectTo: 'info',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
