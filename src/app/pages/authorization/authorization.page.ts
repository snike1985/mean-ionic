import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';
import {SecureStorageService} from '../../services/secure-storage.service';

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.page.html',
})
export class AuthorizationPage implements OnInit {
    public loginForm: FormGroup;
    public isLoad = false;
    private loading;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private apiService: ApiService,
                private alertController: AlertController,
                private secureStorageService: SecureStorageService,
                private loadingController: LoadingController) {
    }

    public ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            login: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required])
        });
        this.loginForm.reset();
    }

    async presentLoading() {
        const loading = await this.loadingController.create();
        await loading.present();
    }

    async dismissLoading() {
        await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }

    async showErrorAlert(text = 'Неизвестная ошибка') {
        const alert = await this.alertController.create({
            header: text,
            buttons: ['OK']
        });

        await alert.present();
    }

    public submitForm(): void {
        const data = {
            login: this.loginForm.controls['login'].value,
            password: this.loginForm.controls['password'].value
        };

        this.presentLoading();

        this.apiService.login(data).subscribe(
            (res) => {
                this.secureStorageService.setTokenToStorage(res['token']);
                this.router.navigate(['/tabs']);
                this.dismissLoading();
            },
            (err) => {
                if (err.status === 403) {
                    this.showErrorAlert('Неправильный логин или пароль!');
                } else {
                    this.showErrorAlert('Ошибка загрузки!');
                }
                this.dismissLoading();
            });
    }
}
