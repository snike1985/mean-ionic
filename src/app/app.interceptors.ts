import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {tap} from 'rxjs/operators';
import {SecureStorageService} from './services/secure-storage.service';
import {Router} from '@angular/router';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    private userToken: string;

    constructor(private secureStorageService: SecureStorageService,
                private router: Router) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler) {

        this.userToken = this.secureStorageService.token;

        const headers = this.userToken ? req.headers.set('Authorization', `Bearer ${this.userToken}`) : null;

        req = req.clone({headers});

        return next.handle(req).pipe(
            tap(
                event => {

                },
                err => {
                    if (err instanceof HttpErrorResponse) {
                        const curErr = err.error;
                        console.log('interceptor error: ', curErr);
                        console.log('interceptor error status: ', err.status);

                        if (err.status === 403) {
                            this.secureStorageService.removeItemFromStorage('epic-token');
                            this.router.navigate(['/authorization']);
                        }
                    }
                }));
    }
}
