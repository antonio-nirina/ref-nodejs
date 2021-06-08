import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../Services/index';
import { SharedService } from '../Services/shared.service';

import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';


@Component({
    selector: 'confirmation-login',
    templateUrl: './src/app/Views/Publipostage/confirmation-login.component.html'

})
export class ConfirmationLoginComponent {  
    @Input() redirect_route;
    @Output() outputEvent: EventEmitter<string> = new EventEmitter();
    @Output() inputDataChange = new EventEmitter();
    // isUserLoggedIn: boolean;

    constructor(public router: Router, private auth: AuthenticationService, private data: SharedService) {
        //this.isUserLoggedIn = auth.loggedIn();

    }

    ngOnInit() {
        this.auth.loggedIn();
        this.data.currentMessage.subscribe(message => this.redirect_route = message)
    }


    savelink(link) {
   
        this.data.changeMessage(link);
    }


   
   
}