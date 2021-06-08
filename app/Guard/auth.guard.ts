import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../Services/index';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthenticationService) { }

    //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //    if (localStorage.getItem('currentUser')) {
    //        // logged in so return true
    //        return true;
    //    }

    //    // not logged in so redirect to login page
    //    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //    return false;
    //}

//}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.auth.userLoggedIn) {
            return true;
        } else {
            if (window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'home' && window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'previsualiser' && window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'confirmation') {
               

                this.router.navigate(['home'], { queryParams: { returnUrl: state.url } });
                }
            //this.router.navigateByUrl('/unauthorized');
            return false;
        }
    }
}