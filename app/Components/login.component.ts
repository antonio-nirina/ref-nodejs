import { Component, OnInit, ViewChild, ElementRef,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm }  from '@angular/forms';
import { AuthenticationService } from '../Services/index';
import { AlertService } from '../Services/alert.service';

@Component({
	selector: 'modal-login',
	moduleId: module.id,
	templateUrl: '../Views/Publipostage/login.component.html'
})

export class LoginComponent implements OnInit {
	@ViewChild('closeModal') closeModal: ElementRef;
	@ViewChild('f') forma: NgForm;
	@Input() redirect_route;

	model: any = {};
	loading = false;
	error = '';
	id: string;
	returnUrl: string;



	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertService: AlertService
	) {
	}


    ngOnInit() {
        // reset login status
        
       // this.authenticationService.logout();
      
       // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        //this.router.navigate([this.returnUrl]);
  
    }

    reset(form: NgForm) {
        form.resetForm();
        
    }

    login() {
        this.loading = true;
        //let mailingID = localStorage.getItem("MailingGroupID");
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {

                //if (result === true) {
                    this.loading = false;
                    this.reset(this.forma);
                    if (this.route.snapshot.queryParams['returnUrl']!= null && this.route.snapshot.queryParams['returnUrl'] != "") {
                      
                        this.router.navigate([this.route.snapshot.queryParams['returnUrl']]);
                    }
                    else {
                        this.router.navigate([this.redirect_route]);
                    }
                    console.log("connexion ekena");
					this.closeModal.nativeElement.click();

                    //alert(this.redirect_route);
                    //this.router.navigate([this.returnUrl]);
                //} else {
                //    //this.error = 'Username or password is incorrect';
                //   // this.alertService.error(error);
                //    this.loading = false;
                //}
            }
            ,
            error => {
                this.error = 'Utilisateur ou mot de passe incorrect.';
                this.alertService.error(this.error);
                this.loading = false;
                console.log("connexion failed");
            });
    }
}
