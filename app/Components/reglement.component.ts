import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReglementMessageService } from '../Services/reglementMessage.service';
import { Subscription } from 'rxjs/Subscription';
import { AppConfig } from '../app.config';

var configurationGlobal = new AppConfig();

@Component({
    selector:'modal-reglement',
    moduleId: module.id,
    templateUrl: '../Views/Publipostage/reglement.component.html'
})

export class ReglementComponent implements OnDestroy {
    @ViewChild('closeModalPayment') closeModal: ElementRef;
    el: HTMLFrameElement;
    title: string;
    subscription: Subscription;
    message: any;

    iFrameSource: string;

    constructor(private reglementMessageService: ReglementMessageService, private router: Router) {
        this.title = "Règlement 1/2";

        reglementMessageService.contentUrlChange$.subscribe(url => {
            //alert("APP " + url);
        })
        let usermail: string;
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser != undefined) {
            usermail = currentUser['Useremail'];
        } 
    }

    ngOnInit() {
        this.el.src = configurationGlobal.apiUrl + "api/Payment/Reglement"; 
        setTimeout(() => {
            //alert('setting url');
            this.reglementMessageService.setURL('http://www.example.com');
        }, 1000);
    }

    onload(ev: Event) {
        this.el = <HTMLFrameElement>ev.srcElement;        
        //@ts-ignore
        if (this.el.height == "300") {
            //@ts-ignore
            this.el.height = "550";
            this.title = "Règlement 2/2";
        }
        else
        {
            this.adjust();
        }
    }


    adjust() {
        //@ts-ignore
        this.el.height = "300";
        //@ts-ignore
        this.el.width = "550";
    }
   

    clicked(event) {
        this.el.src = configurationGlobal.apiUrl + "api/Payment/Reglement";
    }

    close()
    {
        this.closeModal.nativeElement.click();
    }


    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
