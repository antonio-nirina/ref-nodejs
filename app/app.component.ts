import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './Services/index';
import { SharedService } from './Services/shared.service';
import { BlockWithProgress } from './Components/BlockWithProgress.component';
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'my-app',
    templateUrl: './src/app/Views/Shared/MasterLayout.html'
    
})
export class AppComponent {
    title = 'home';
    isUserLoggedIn: boolean;
    redirect_route = '';
    blockTemplate = BlockWithProgress;
  
 

    constructor(public router: Router, private auth: AuthenticationService, private data: SharedService) {
       

    }
   
    isActive(data: any[]): boolean {
        return this.router.isActive(
            this.router.createUrlTree(data),
            true);
    }


    onComponentChange(value) {      
        this.redirect_route = value;      
       
    }


    ngOnInit() {


        //var observable = Observable.create((observer) => {
        //    setTimeout(() => {
        //        observer.next('some event');
        //    }, 500);
        //});
        
        Observable.interval(5000).subscribe(x => {
            if (this.auth.checkCookie()) {
                this.auth.loggedIn();
            }
            else {
                this.auth.logout();
            }
        });
        
        this.data.currentMessage.subscribe(message => this.redirect_route = message)

        //var isLogged = this.auth.serverCheckIsLogged();
        //isLogged.subscribe(
        //    response => {
        //        if (response["IsLoggedIn"] == "true") {
        //            this.auth.processTokenFromSP_GP(response);
        //            this.auth.userLoggedIn = true;
        //            if (this.auth.isLoginSubject.value != this.auth.userLoggedIn) {
        //                this.auth.isLoginSubject.next(this.auth.userLoggedIn);
        //            }
                  
        //        }
        //        else {
        //            this.auth.token = null;
        //            localStorage.clear();
        //            sessionStorage.clear();
        //            this.auth.endSession();
        //            this.auth.userLoggedIn = false;
        //            if (this.auth.isLoginSubject.value != this.auth.userLoggedIn) {
        //                this.auth.isLoginSubject.next(this.auth.userLoggedIn);
        //            }
                  

        //        }
        //    });
    }
  
  
   
    
}



