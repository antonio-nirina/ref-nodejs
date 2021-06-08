import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertService } from '../Services/alert.service'
import { /*AlertService, */ UserService } from '../Services/index';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../Services/index';

@Component({
    selector: 'newpassword',
    moduleId: module.id,
    templateUrl: '../Views/Publipostage/newpassword.component.html'
})

export class NewPasswordComponent {
    model: any = {};
    showForm: boolean;
    error: boolean = false;
    finished: boolean = false;
    message: string;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService
    ) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.model.ConfirmationCode = params['code'];
            if (this.model.ConfirmationCode == null) {
                this.showForm = false;
                this.message = "Aucun code d'activation fourni";
            }
            else {
           

                this.userService.checkcode(this.model).subscribe(
                    data => {
                     
                        if (data == true) {

                            this.showForm = true;

                        }
                        else {
                            this.showForm = false;
                            this.message = "Votre code de réinitialisation de mot de passe est invalide";
                        }

                    },
                    error => {
                        this.showForm = false;
                        this.message = "Votre code de réinitialisation de mot de passe est invalide";
                    });
               

               
            }
        
        });
       
    }


    changePassword() {


        if (this.model.Userpassword != this.model.Confpassword) {
            this.error = true;
            this.message = "Votre champs : Mot de passe et Confirmation Mot de pass ne sont pas identiques";
            return;
        }

        this.userService.changepassword(this.model).subscribe(
            data => {
                this.model.Message = data;
                if (data == true) {
                    this.showForm = false;
                    this.message = "Le mot de passe a été modifié avec succès.";
                    this.finished = true;
                }
                else {
                    this.showForm = false;
                    this.message = "Error";

                }

            },
            error => {
                // this.alertService.error(error._body);
                this.showForm = false;
                this.message = "Error";
            });
    }
}