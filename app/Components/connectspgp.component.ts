import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthenticationService } from '../Services/index';
import { AlertService } from '../Services/alert.service';

@Component({
    templateUrl: '../Views/Publipostage/connectspgp.component.html'
})

export class ConnectSPGP implements OnInit {
  

    model: any = {};
    loading = false;
    error = '';
    id: string;
    returnUrl: string;



    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.loading = true;

        this.route.params.subscribe((params: Params) => {
            let userId = params['userId'];
       
        });
        //let mailingID = localStorage.getItem("MailingGroupID");
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {

                //if (result === true) {
                this.loading = false;
               // this.router.navigate('home');

             
            }
            ,
            error => {
                this.error = 'Utilisateur ou mot de passe incorrect.';
                this.alertService.error(this.error);
                this.loading = false;
            });

    }

 

    
}
