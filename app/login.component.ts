import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './Services/index';

import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ConfirmDialog } from './Components/confirm-dialog.component';
import { DialogsService } from './Services/dialogs.service';
import { ErrorDialog } from './Components/error-dialog.component';

@Component({
    selector: 'login',
    templateUrl: './src/app/Views/Shared/Login.html'

})
export class LoginViewComponent {
    title = 'login';
    userfullname: string;
    @Input() redirect_route;
    @Output() outputEvent: EventEmitter<string> = new EventEmitter();
	@Output() inputDataChange = new EventEmitter();
	showMobileMenu: boolean;
   // isUserLoggedIn: boolean;

    constructor(public router: Router, private auth: AuthenticationService, private dialogsService: DialogsService) {
        //this.isUserLoggedIn = auth.loggedIn();
		this.showMobileMenu = false;
    }

    ngOnInit() {
        this.auth.loggedIn();

        this.auth.FirstNameLastName.subscribe((val) => {
            this.userfullname = val;

        });
    }


    savelink(link) {
        // this.redirect_route = link;
		this.showMobileMenu = !this.showMobileMenu;
        if (link == "") {
            let currentURL = this.router.url;
            this.outputEvent.emit(currentURL);
            this.inputDataChange.emit(currentURL);
        }
        else {
            this.outputEvent.emit(link);
            this.inputDataChange.emit(link);
        }
    }


    warnUser() {
        var returnValue: boolean;

        //check same as in loggin page
        if (localStorage.getItem("MailingGroupID") != null) {

            let dialogRef: MdDialogRef<ConfirmDialog>;
            dialogRef = this.dialogsService.confirm('Si vous vous déconnectez, tout le processus sera perdu', 'Voulez -vous poursuivre?');

            dialogRef.afterClosed().subscribe(result => {
                returnValue = result;
               
                if (returnValue == true) {
                    this.deconnect();
                }
                else {
                    return;
                }
            });
        }
        else {
            this.deconnect();
        }
    }

	deconnect() {
		this.showMobileMenu = !this.showMobileMenu;
        this.auth.logout();
        this.auth.endSessionProgress.next(true);
        this.auth.endSession()
            .subscribe((response) => {
                this.auth.endSessionProgress.next(false); this.auth.loggedIn();
                //if (window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'home' && window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'previsualiser' && window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'confirmation') {
                
                    
                //        this.router.navigate(['home']);
                //    }
            },
            error => {
            });
    

    }
   
}