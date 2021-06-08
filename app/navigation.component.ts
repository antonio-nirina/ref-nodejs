import { Component, ViewChild, Input,Output,EventEmitter} from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './Services/index';
import { PreparationService } from "./Services/preparation.service";
import { User } from "./Models/user";
import { NgForm, FormsModule  } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockWithProgress } from './Components/BlockWithProgress.component';

@Component({
    selector: 'navigation',
    templateUrl: './src/app/Views/Shared/Navigation.html',
    providers:[User]

})
export class NavigationComponent {
    model: any = {};
    @ViewChild('f') forma: NgForm;
    title = 'navigation';
    userfullname = '';
    useremail = '';
    @Output() resetMailing = new EventEmitter();
    @BlockUI() blockUI: NgBlockUI;
    @Input() redirect_route;
    @Output() outputEvent: EventEmitter<string> = new EventEmitter();
    @Output() inputDataChange = new EventEmitter();
    removeMesg: boolean;
    // isUserLoggedIn: boolean;

    constructor(public router: Router, private auth: AuthenticationService, private prep:PreparationService, private user: User) {
        //this.isUserLoggedIn = auth.loggedIn();
       
      
    }

    ngOnInit() {
        this.removeMesg = false;
        this.model.emailTo = "marketing@servicepostal.com";
        this.auth.loggedIn();
      
       
                        this.auth.FirstNameLastName.subscribe((val) => {
                            this.model.FullName = val;
                            if (this.forma != null && this.forma.controls != null && this.forma.controls['FullName'] != null && this.forma.controls['FullName'].value != "") {
                                this.forma.controls['FullName'].setErrors(null);
                            }
                            
        });


                        this.auth.Useremail.subscribe((val) => {
                            this.model.uemail = val;
                            if (this.forma != null && this.forma.controls != null && this.forma.controls['uemail'] != null && this.forma.controls['uemail'].value != "") {
                                this.forma.controls['uemail'].setErrors(null);
                            }
                           
                        });
                                              
    }

  

    savelink(link)
    {
       // this.redirect_route = link;
        this.outputEvent.emit(link);
        this.inputDataChange.emit(link);
    }

    deconnect() {
        this.auth.logout();
       // this.router.navigate(['home']);
    }

    newMailingGroup() {
        //localStorage.removeItem("MailingGroupID");
        //create new session or remove mailing from the session that still exist
        this.router.navigate(['home']);
       
    }

    reset(form: NgForm) {
        this.removeMesg = false;
        form.resetForm();
        //this.model.emailTo = "marketing@servicepostal.com";
        this.forma.controls['emailTo'].setValue('marketing@servicepostal.com');
        this.forma.controls['EmailContent'].setValue('');
        //this.forma.controls['EmailContent'].markAsPristine = false;
       // this.forma.controls['EmailContent'].setErrors(null);
        this.forma.controls['Subject'].setValue('');

             this.auth.FirstNameLastName.subscribe((val) => {
                 this.forma.controls['FullName'].setValue(val);
                            if (this.forma != null && this.forma.controls != null && this.forma.controls['FullName'] != null && this.forma.controls['FullName'].value != "") {
                                this.forma.controls['FullName'].setErrors(null);
                            }
                            
        });


                        this.auth.Useremail.subscribe((val) => {
                          
                            this.forma.controls['uemail'].setValue(val);
                            if (this.forma != null && this.forma.controls != null && this.forma.controls['uemail'] != null && this.forma.controls['uemail'].value != "") {
                                this.forma.controls['uemail'].setErrors(null);
                            }
                           
                        });
        //this.forma.controls['Subject'].setErrors(null);
        //this.forma.controls['uemail'].setErrors(null);
        //this.forma.controls['FullName'].setErrors(null);
    }
    sendEmail() {
        //this.blockUI.start();
        this.removeMesg = true;
        this.prep.sendContactEmail(this.model).subscribe(response => {
            if (response = true) {


                //this.forma.controls['EmailContent'].setValue('');
                //this.forma.controls['EmailContent'].setErrors(null);
                //this.forma.controls['Subject'].setValue('');
                //this.forma.controls['Subject'].setErrors(null);  
                //this.forma.controls['uemail'].setErrors(null);  
                //this.forma.controls['FullName'].setErrors(null);  
                this.model.message = "Votre email est envoyé.";
                //this.blockUI.stop();
            }
            else {
              
                //this.forma.controls['EmailContent'].setValue('');
                //this.forma.controls['EmailContent'].setErrors(null);
                //this.forma.controls['Subject'].setValue('');
                //this.forma.controls['Subject'].setErrors(null);  
                //this.forma.controls['uemail'].setErrors(null);
                //this.forma.controls['FullName'].setErrors(null); 
                this.model.message = "Une erreur s'est produite. Veuillez réessayer.";
             
            }
        });
     
    }

   
}

