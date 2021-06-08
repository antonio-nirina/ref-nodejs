import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { /*AlertService, */ UserService } from '../Services/index';

@Component({
    selector: 'modal-password-forget',
    moduleId: module.id,
    templateUrl: '../Views/Publipostage/passwordforgot.component.html'
})

export class PasswordForgetComponent {
    model: any = {};
    loading = false;
    @ViewChild('closeModal') closeModal: ElementRef;
   

    constructor(
        private router: Router,
        private userService: UserService,
       /* private alertService: AlertService*/) { }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
            data => {
                //this.alertService.success('Registration successful', true);
                this.router.navigate(['/login']);
            },
            error => {
               // this.alertService.error(error._body);
                this.loading = false;
            });
    }



    sendemailpassword() {
        this.userService.sendemailpassword(this.model).subscribe(
            data => {
                this.model.Message = data;
                if (data == "OK") {
                    setTimeout(() => this.closeModal.nativeElement.click(), 2000);
                }
              
            },
            error => {
                // this.alertService.error(error._body);
                this.loading = false;
            }); 
    }
}