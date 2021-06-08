import { Component, ViewChild, Input, Renderer2, Inject, ElementRef } from '@angular/core';
//debut code tag manager dera Renderer2, Inject,
import { Router } from '@angular/router';
import { AlertService } from '../Services/alert.service'
import { /*AlertService, */ UserService } from '../Services/index';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../Services/index';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
//debut code tag manager dera DOCUMENT
import { DOCUMENT } from '@angular/platform-browser';
@Component({
    selector: 'modal-register',
    moduleId: module.id,
    templateUrl: '../Views/Publipostage/register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;
    @ViewChild('closeModal') closeModal: ElementRef;
    @ViewChild('f') forma: NgForm;
    @Input() redirect_route;
    errorMessage = '';
	//@Input() password: string;


    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        //debut code tag manager dera
        private renderer2: Renderer2,
        @Inject(DOCUMENT) private _document
        //end
	) {
    }

    ngOnInit() {
        this.model.UserTypeID = '5';
        this.model.AcceptComercials = false;
    }

    reset(form: NgForm) {
        form.resetForm();

    }

    register() {
        if (this.model.Useremail != this.model.Confemail)
        {
            this.errorMessage = "Votre champs : Adresse Email et Confirmation Adresse Email ne sont pas identiques";
            return;
        }

        if (this.model.Userpassword != this.model.Confpassword) {
            this.errorMessage = "Votre champs : Mot de passe et Confirmation Mot de pass ne sont pas identiques";
            return;
		}

        if (this.model.UserTypeID == '5' && this.model.Siren.length != 9) {
			this.errorMessage = "Siren doit avoir 9 chiffres";
			return;
		}

        this.loading = true;

       // let mailingID = localStorage.getItem("MailingGroupID");

        var response = null;

        response = this.userService.create(this.model);
        response.subscribe(
            response => {
                this.loading = false;

                if (response == "SUCCESS")
                {
                    //debut code tag manager dera
                    const s = this.renderer2.createElement('script');
                    s.text = " window.dataLayer = window.dataLayer || [];window.dataLayer.push({ 'event': 'inscription'});";
                    this.renderer2.appendChild(this._document.body, s);
                    //end
                    this.authenticationService.login(this.model.Useremail, this.model.Userpassword).subscribe(result =>
                    {
                        this.loading = false;
                        this.reset(this.forma);
                        this.router.navigate([this.redirect_route]);
                        this.closeModal.nativeElement.click();
                        this.errorMessage = "";
                    }
                    ,
                    error => {
                        this.errorMessage = error;
                        this.loading = false;
                    });
                }
                else
                {
                    this.errorMessage = response;
                    this.loading = false;
                }
            },
            error => {
                this.errorMessage = error;
                this.loading = false;
            });
    }
}