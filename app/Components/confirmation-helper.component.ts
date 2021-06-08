import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReglementMessageService } from '../Services/reglementMessage.service';

@Component({
    selector: 'confirmation-helper',
    templateUrl: './src/app/Views/Publipostage/confirmation-helper.component.html'

})

export class ConfirmationHelperComponent {


    constructor(private router: Router, private reglementMessageService: ReglementMessageService) {

    
        reglementMessageService.contentUrlChange$.subscribe(url => {
            alert("PREVIEW " + url);
        })
    }


   

    //ngOnInit() {

    //    //this.closeModal.nativeElement.click();
    //   // this.router.navigate(['./home']);

    //    this.reglementMessageService.sendMessage('OK');
    //}


    //sendMessage(): void {
    //    // send message to subscribers via observable subject
    //    this.reglementMessageService.sendMessage('Message from Home Component to App Component!');
    //}
}