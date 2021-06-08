import { Injectable, Injector } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthenticationService } from './Services/index';


@Injectable()
export class AuthenticatedHttpService extends Http {
    auth: AuthenticationService

    constructor(backend: XHRBackend, defaultOptions: RequestOptions, private injector: Injector) {
        super(backend, defaultOptions);
        setTimeout(() => {
            this.auth = this.injector.get(AuthenticationService);
        })
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options).catch((error: Response) => {
            if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
                
               // this.auth.logout();
                //if (window.location.href.substr(window.location.href.lastIndexOf('/') + 1) == 'previsualiser' || window.location.href.substr(window.location.href.lastIndexOf('/') + 1) == 'confirmation') {
                    
                //    window.location.href = "http://publipostage.servicepostal.com/home";
                //}
                //if (this.auth.userLoggedIn == true) {
                    this.auth.logout();
                //}
                //else {

                //    window.location.href = window.location.href;
                //}
                
            }
            return Observable.throw(error);
        });
    }
}