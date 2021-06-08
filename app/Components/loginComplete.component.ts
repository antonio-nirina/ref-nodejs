import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthenticationService } from '../Services/index';
import { AlertService } from '../Services/alert.service';
import { UserService } from '../Services/index';

@Component({
    selector: 'login-complete',
    moduleId: module.id,
    templateUrl: '../Views/Publipostage/loginComplete.component.html'
})

export class LoginCompleteComponent implements OnInit {    
    @ViewChild('loginForm') logForm: NgForm;
    @ViewChild('register') regForm: NgForm;
    @ViewChild('passwordForm') passwordForm: NgForm;

    loginModel: any = {};
    regModel: any = {};
    passwordModel: any = {};
    loading = false;
    error = '';
    id: string;
    returnUrl: string;
    segment: number;
    errorMessage = '';
    

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.segment = 1;
    }

    reset(form: NgForm) {
        form.resetForm();

    }

    login() {
        this.loading = true;
       // let mailingID = localStorage.getItem("MailingGroupID");
        this.authenticationService.login(this.loginModel.username, this.loginModel.password)
            .subscribe(result => {
                
                this.loading = false;
                this.reset(this.logForm);
            }
            ,
            error => {
                this.error = 'Utilisateur ou mot de passe incorrect.';
                this.alertService.error(this.error);
                this.loading = false;
            });
    }

    setSegment(num: number) {
        this.segment = num;
    }
    
    register() {
        if (this.regModel.Useremail != this.regModel.Confemail) {
            this.errorMessage = "Votre champs : Adresse Email et Confirmation Adresse Email ne sont pas identiques";
            return;
        }

        if (this.regModel.Userpassword != this.regModel.Confpassword) {
            this.errorMessage = "Votre champs : Mot de passe et Confirmation Mot de pass ne sont pas identiques";
            return;
        }

        this.loading = true;

        //let mailingID = localStorage.getItem("MailingGroupID");

        var response = null;

        response = this.userService.create(this.regModel);
        response.subscribe(
            response => {
                this.loading = false;

                if (response == "SUCCESS") {
                    this.authenticationService.login(this.regModel.Useremail, this.regModel.Userpassword).subscribe(result => {
                        this.loading = false;
                        this.reset(this.regForm);
                        this.errorMessage = "";
                    }
                        ,
                        error => {
                            this.errorMessage = error;
                            this.loading = false;
                        });
                }
                else {
                    this.errorMessage = response;
                    this.loading = false;
                }
            },
            error => {
                this.errorMessage = error;
                this.loading = false;
            });
    }


    sendemailpassword() {
        this.userService.sendemailpassword(this.passwordModel).subscribe(
            data => {
                this.passwordModel.Message = data;
                //if (data == "OK") {
                //    setTimeout(() => this.closeModal.nativeElement.click(), 2000);
                //}

            },
            error => {
                // this.alertService.error(error._body);
                this.loading = false;
            });
    }
}

export enum Segment {
    login = 1,
    register = 2,
    forgotpassword = 3
}
