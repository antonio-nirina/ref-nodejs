import { Component, Input, Output, EventEmitter } from "@angular/core";

import { MailingGroup } from '../Models/mailingGroup';
import { LetterType } from '../Models/letterType';

import { PreparationService } from '../Services/preparation.service';
import { TempAddressService } from '../Services/tempAddress.service';
import { MailingService } from '../Services/mailing.service';

import { AuthenticationService } from '../Services/index';

@Component({
    moduleId: module.id,
    selector: "mon-mailing",
    templateUrl: '../Views/Publipostage/monMailing.component.html'
})
export class MonMailing {

    @Input('mailingGroup') _model: MailingGroup = new MailingGroup();
    @Input('letterTypes') letterTypes: LetterType[];
    @Input('parentContoroller') parentContoroller: string;
    @Input('dateLaPoste') estimateDateLaPoste: string;

    

    @Output() reset = new EventEmitter();
    totalSelectedAddress: number;
    errorMessage: any;
    estimatePagesPerLetter: number;
    

    constructor(private preparationService: PreparationService,
        private auth: AuthenticationService,
        private tempAddressService: TempAddressService,
        private mailingService: MailingService) {

    }


    ngOnInit() {

      
        if (this.parentContoroller == 'previsualiser') {
            var tempAddresses = null;
            tempAddresses = this.tempAddressService.GetTempAddresses();
            tempAddresses.subscribe(
                tempAddresses => {
                    this.totalSelectedAddress = tempAddresses.length;

                },
                error => this.errorMessage = <any>error
            );

            var pages = null;
            pages = this.mailingService.getTotalNumberOfPapers();
            pages.subscribe(
                pages => {
                    this.estimatePagesPerLetter = pages;

                },
                error => this.errorMessage = <any>error
            );

            //var dateSending = null;

            //dateSending = this.mailingService.getDateLaPoste();

            //dateSending.subscribe(
            //    date => {
            //        this.estimateDateLaPoste = date;

            //    },
            //    error => this.errorMessage = <any>error
            //);
        }
    }

    ResetMailingGroup() {
        this.reset.emit();
    }
    
}