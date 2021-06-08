import { Component, OnInit } from '@angular/core';

import { AlertService } from '../Services/alert.service';

import { AuthenticationService } from '../Services/index';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: '../Views/Publipostage/alert.component.html'
})

export class AlertComponent {
    message: any;

    constructor(private alertService: AlertService, private auth: AuthenticationService) { }

    ngOnInit() {

        //if (this.auth.loggedIn()) {
        //    this.auth.startupTokenRefresh();
        //}
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}