import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MesMailingService } from '../Services/mesMailing.service';
import { PrevisualiserService } from '../Services/previsualiser.service';
import { PreparationService } from '../Services/preparation.service';
import { MesMailing } from '../Models/mesMailing';
import { Letter } from '../Models/Letter';
import { Country } from '../Models/country';
import { AuthenticationService } from '../Services/index';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DialogsService } from '../Services/dialogs.service';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ErrorDialog } from '../Components/error-dialog.component';
import { DatexPipe } from '../Pipes/datex.pipe';
import * as _ from 'underscore';
import { PagerService } from '../services/pager.service';

@Component({
    selector: 'mesMailing',
    templateUrl: './src/app/Views/Publipostage/mesMailing.component.html',
    providers: [PagerService]
})
export class MesMailingComponent {

    private postLink: string = "http://www.csuivi.courrier.laposte.fr/suivi/index?id=";
    toggle = {};
    countries: Country[];
    private username: string;
    mesMailing: MesMailing[];
    letters: Letter[];
    private errorMessage: string;
    private mailingGroupID: string;
    private showPostNumberForLetter: boolean;
    hrefFactureUrl: any;
    hrefFactureName: string;
    hrefMainDocUrl: any;
    hrefMainDocName: string;
    hrefCSVUrl: any;
    hrefCSVName: string;
    hrefAnnexUrl: any;
    hrefAnnexName: string;
    @ViewChild('downloadFacture') downloadFacture: ElementRef;
    @ViewChild('downloadMainDoc') downloadMainDoc: ElementRef;
    @ViewChild('downloadCSV') downloadCSV: ElementRef;
    @ViewChild('downloadAnnex') downloadAnnex: ElementRef;
    //pager: any = {};
    //pagedItems: any[];
    //pageSize: number;
    keyword: string;
    binaryString: any;
    hrefUrl: any;
    hrefName: string;
    @BlockUI() blockUI: NgBlockUI;
    showLoading: boolean;
    waitDownload: boolean[];
    subscriptionSPTypeID: number;
    showArchived: boolean;
    goToPage: number;

    public lettersPagingConfig: PaginationInstance;
    public mailingPagingConfig: PaginationInstance;

    constructor(private mailingService: MesMailingService,
        private previsualiserService: PrevisualiserService,
        private preparationService: PreparationService,
        private pagerService: PagerService,
        private sanitizer: DomSanitizer,
        private auth: AuthenticationService,
        private dialogsService: DialogsService
    ) {
   
        this.showLoading = false;
        //this.waitDownload = false;
        this.mesMailing = new Array<MesMailing>();
        this.letters = new Array<Letter>();

        this.lettersPagingConfig = {
            id: 'letters',
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: 0
        }

        this.mailingPagingConfig = {
            id: 'mailings',
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: 0
        }

        this.subscriptionSPTypeID = 0;
    }

    ngOnInit() {

        //if (this.auth.loggedIn()) {
        //    this.auth.startupTokenRefresh();
        //}
        
        var currentUser;// = JSON.parse(localStorage.getItem('currentUser'));
        this.auth.getUser()
            .subscribe((response) => {
                currentUser = JSON.parse(response._body);
                if (currentUser && currentUser != undefined) {
                    this.username = currentUser['Useremail'];
                    this.loadMailingGroups();

                    var countries = null;
                    countries = this.preparationService.getAllCountries();
                    countries.subscribe(
                        countries => this.countries = countries,
                        error => this.errorMessage = <any>error
                    );

                }
              
            },
            error => { this.errorMessage = <any>error; });

        this.showArchived = true;

    }

    viewAllDestinations(mailingGroupID: string, adminStatusID: number, letterTypeID: number) {
        this.letters = [];
        var letters;
        this.lettersPagingConfig.currentPage = 1;
        this.mailingGroupID = mailingGroupID;
        this.showPostNumberForLetter = adminStatusID >= 15 && (letterTypeID == 1 || letterTypeID == 2 || letterTypeID == 6);
        letters = this.mailingService.getPreviewLetters(mailingGroupID, this.lettersPagingConfig.currentPage, this.lettersPagingConfig.itemsPerPage);
        letters.subscribe(
            data => {
                this.letters = data["data"];
                this.lettersPagingConfig.totalItems = data["count"];
                for (let i = 0; i < this.letters.length; i++){
                    this.binaryString = this._base64ToArrayBuffer(this.letters[i].LetterBase64);

                    var blob = new Blob([this.binaryString], {
                        type: "application/pdf"
                    });
                    this.letters[i].HrefURL = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                    this.letters[i].HrefName = "document_" + this.letters[i].LetterID + ".pdf";
                }
                
            },
            error => this.errorMessage = <any>error
        );
    }

    goToPageLetters() {
        let pages: number = (Math.ceil(this.lettersPagingConfig.totalItems / 10));

        if (this.goToPage <= pages) {
            this.onPageChangeLetter(this.goToPage);
        }
        else {
            this.goToPage = null;
        }
    }

    onPageChangeLetter(pageNumber: number) {
        this.letters = [];
        var letters;
        letters = this.mailingService.getPreviewLetters(this.mailingGroupID, pageNumber, this.lettersPagingConfig.itemsPerPage);
        letters.subscribe(
            data => {
                this.letters = data["data"];
                this.lettersPagingConfig.totalItems = data["count"];
                this.lettersPagingConfig.currentPage = pageNumber;
                for (let i = 0; i < this.letters.length; i++) {
                    if (this.letters[i].LetterBase64 != null) {
                        this.binaryString = this._base64ToArrayBuffer(this.letters[i].LetterBase64);

                        var blob = new Blob([this.binaryString], {
                            type: "application/pdf"
                        });
                        this.letters[i].HrefURL = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                        this.letters[i].HrefName = "document_" + this.letters[i].LetterID + ".pdf";
                    }
                }
            },
            error => this.errorMessage = <any>error
        );
        this.lettersPagingConfig.currentPage;
    }

    onPageChangeMailing(pageNumber: number) {
        //this.blockUI.start();
        this.showLoading = true;
        this.mesMailing = [];
        var mesMailing;
        mesMailing = this.mailingService.getMailingGroup(this.username, pageNumber, this.mailingPagingConfig.itemsPerPage, this.showArchived);
        mesMailing.subscribe(
            data => {
                this.mesMailing = data["data"];
                this.mailingPagingConfig.totalItems = data["count"];
                this.subscriptionSPTypeID = data["subscriptionSPTypeID"];
                this.mailingPagingConfig.currentPage = pageNumber;
                //this.blockUI.stop();   
                this.showLoading = false;
            },
            error => this.errorMessage = <any>error
        );
        this.mailingPagingConfig.currentPage;
    }

    popupText(mailing: MesMailing) {
        mailing.MailingGroupID;
    }

    archiveMailingToggle(mailingGroupID: string) {
        var message;
        message = this.mailingService.archiveMailingToggle(mailingGroupID);
        message.subscribe(
            message => {
              
                this.loadMailingGroups();
            },
            error => this.errorMessage = <any>error
        );
    }

    loadMailingGroups() {
        //this.blockUI.start();
        this.showLoading = true;
        var mesMailing;
        this.mailingPagingConfig.currentPage = 1;
        mesMailing = this.mailingService.getMailingGroup(this.username, this.mailingPagingConfig.currentPage, this.mailingPagingConfig.itemsPerPage, this.showArchived);
        mesMailing.subscribe(
            data => {
                this.mesMailing = data["data"];
                this.mailingPagingConfig.totalItems = data["count"];
                this.subscriptionSPTypeID = data["subscriptionSPTypeID"];
                // this.blockUI.stop();
                this.showLoading = false;
            },
            error => { this.errorMessage = <any>error; this.blockUI.stop(); }
        );
    }

    downloadLetter(letterID: number) {
        var letterFile = null;
        letterFile = this.mailingService.getBinatyLetter(letterID);
        letterFile.subscribe(
            data => {

                let fileURL = URL.createObjectURL(data);
                window.open(fileURL);                
            }
        );
    }

    getFacture(orderID: number)
    {
        //this.blockUI.start();
        //this.showLoading = true;
        for (var i = 0; i < this.mesMailing.length; i++) {
            if (this.mesMailing[i].OrderID == orderID) {
                this.mesMailing[i].WaitDownloadInvoice = true;
            }
        }
        var binaryString = null;
        binaryString = this.preparationService.getFacture(orderID);
        binaryString.subscribe(
            data => {
                if (data != null)
                {
                    if (data.name == "no invoice details") {
                        let dialogRef: MdDialogRef<ErrorDialog>;
                        dialogRef = this.dialogsService.error("No invoice details were generated", "");
                        //this.blockUI.stop();
                        //this.showLoading = false;
                        for (var i = 0; i < this.mesMailing.length; i++) {
                            if (this.mesMailing[i].OrderID == orderID) {
                                this.mesMailing[i].WaitDownloadInvoice = false;
                            }
                        }
                    }
                    else
                    {
                        this.binaryString = this._base64ToArrayBuffer(data.bytes);


                        var blob = new Blob([this.binaryString], {
                            type: "application/pdf"
                        });
                        this.hrefFactureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                        this.hrefFactureName = data.name + ".pdf";


                        setTimeout(() => {
                            this.downloadFacture.nativeElement.click();

                            for (var i = 0; i < this.mesMailing.length; i++) {
                                if (this.mesMailing[i].OrderID == orderID) {
                                    this.mesMailing[i].WaitDownloadInvoice = false;
                                }
                            }
                            //this.blockUI.stop();
                            //this.showLoading = false;

                        }, 2000);
                    }

                }
                else
                {
                    let dialogRef: MdDialogRef<ErrorDialog>;
                    dialogRef = this.dialogsService.error("No factures for this month", "");
                    //this.blockUI.stop();
                    //this.showLoading = false;
                    for (var i = 0; i < this.mesMailing.length; i++) {
                        if (this.mesMailing[i].OrderID == orderID) {
                            this.mesMailing[i].WaitDownloadInvoice = false;
                        }
                    }
                }
            },
            error => {
                let dialogRef: MdDialogRef<ErrorDialog>;
                dialogRef = this.dialogsService.error("Some error", "");
                //this.blockUI.stop();
                //this.showLoading = false;
                for (var i = 0; i < this.mesMailing.length; i++) {
                    if (this.mesMailing[i].OrderID == orderID) {
                        this.mesMailing[i].WaitDownloadInvoice = false;
                    }
                }
            }
        );
    }


    getMainDoc(orderID: number) {
        for (var i = 0; i < this.mesMailing.length; i++) {
            if (this.mesMailing[i].OrderID == orderID) {
                this.mesMailing[i].WaitDownloadInvoice = true;
            }
        }
        var binaryString = null;
        binaryString = this.preparationService.getMainDoc(orderID);
        binaryString.subscribe(
            data => {
                if (data != null && data.bytes != null) {
                    this.binaryString = this._base64ToArrayBuffer(data.bytes);


                    var blob = new Blob([this.binaryString], {
                        type: "application/pdf"
                    });


                    this.hrefMainDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                    this.hrefMainDocName = data.name;

                    setTimeout(() => {
                        this.downloadMainDoc.nativeElement.click();

                        for (var i = 0; i < this.mesMailing.length; i++) {
                            if (this.mesMailing[i].OrderID == orderID) {
                                this.mesMailing[i].WaitDownloadInvoice = false;
                            }
                        }

                    }, 1000);


                }
                else {
                    let dialogRef: MdDialogRef<ErrorDialog>;
                    dialogRef = this.dialogsService.error(data.name, "");
                    for (var i = 0; i < this.mesMailing.length; i++) {
                        if (this.mesMailing[i].OrderID == orderID) {
                            this.mesMailing[i].WaitDownloadInvoice = false;
                        }
                    }
                }
            },
            error => {
                let dialogRef: MdDialogRef<ErrorDialog>;
                dialogRef = this.dialogsService.error("Some error", "");
                for (var i = 0; i < this.mesMailing.length; i++) {
                    if (this.mesMailing[i].OrderID == orderID) {
                        this.mesMailing[i].WaitDownloadInvoice = false;
                    }
                }
            }
        );
    }


    getCSV(orderID: number) {
        for (var i = 0; i < this.mesMailing.length; i++) {
            if (this.mesMailing[i].OrderID == orderID) {
                this.mesMailing[i].WaitDownloadInvoice = true;
            }
        }
        var binaryString = null;
        binaryString = this.preparationService.getCSV(orderID);
        binaryString.subscribe(
            data => {
                if (data != null && data.bytes != null) {
                    this.binaryString = this._base64ToArrayBuffer(data.bytes);

                    var blob = new Blob([this.binaryString], {
                        type: "application/pdf"
                    });


                    this.hrefCSVUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                    this.hrefCSVName = data.name;

                    setTimeout(() => {
                        this.downloadCSV.nativeElement.click();

                        for (var i = 0; i < this.mesMailing.length; i++) {
                            if (this.mesMailing[i].OrderID == orderID) {
                                this.mesMailing[i].WaitDownloadInvoice = false;
                            }
                        }

                    }, 1000);


                }
                else {
                    let dialogRef: MdDialogRef<ErrorDialog>;
                    dialogRef = this.dialogsService.error(data.name, "");
                    for (var i = 0; i < this.mesMailing.length; i++) {
                        if (this.mesMailing[i].OrderID == orderID) {
                            this.mesMailing[i].WaitDownloadInvoice = false;
                        }
                    }
                }
            },
            error => {
                let dialogRef: MdDialogRef<ErrorDialog>;
                dialogRef = this.dialogsService.error("Some error", "");
                for (var i = 0; i < this.mesMailing.length; i++) {
                    if (this.mesMailing[i].OrderID == orderID) {
                        this.mesMailing[i].WaitDownloadInvoice = false;
                    }
                }
            }
        );
    }


    getAnnex(orderID: number) {
        for (var i = 0; i < this.mesMailing.length; i++) {
            if (this.mesMailing[i].OrderID == orderID) {
                this.mesMailing[i].WaitDownloadInvoice = true;
            }
        }
        var binaryString = null;
        binaryString = this.preparationService.getAnnex(orderID);
        binaryString.subscribe(
            data => {
                if (data != null && data.bytes != null) {
                    this.binaryString = this._base64ToArrayBuffer(data.bytes);

                    var blob = new Blob([this.binaryString], {
                        type: "application/pdf"
                    });


                    this.hrefAnnexUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                    this.hrefAnnexName = data.name;

                    setTimeout(() => {
                        this.downloadAnnex.nativeElement.click();

                        for (var i = 0; i < this.mesMailing.length; i++) {
                            if (this.mesMailing[i].OrderID == orderID) {
                                this.mesMailing[i].WaitDownloadInvoice = false;
                            }
                        }

                    }, 1000);


                }
                else {
                    let dialogRef: MdDialogRef<ErrorDialog>;
                    dialogRef = this.dialogsService.error(data.name, "");
                    for (var i = 0; i < this.mesMailing.length; i++) {
                        if (this.mesMailing[i].OrderID == orderID) {
                            this.mesMailing[i].WaitDownloadInvoice = false;
                        }
                    }
                }
            },
            error => {
                let dialogRef: MdDialogRef<ErrorDialog>;
                dialogRef = this.dialogsService.error("Some error", "");
                for (var i = 0; i < this.mesMailing.length; i++) {
                    if (this.mesMailing[i].OrderID == orderID) {
                        this.mesMailing[i].WaitDownloadInvoice = false;
                    }
                }
            }
        );
    }

    toggleShowArchived() {
        this.showArchived = !this.showArchived;
        this.onPageChangeMailing(this.mailingPagingConfig.currentPage);
    }
    
    //pager methods
    //setPage(page: number) {
    //    if (page < 1 || page > this.pager.totalPages) {
    //        return;
    //    }
    //    let list: Letter[];

    //    list = this.letters;

    //    // get pager object from service
    //    this.pager = this.pagerService.getPager(list.length, page, this.pageSize);

    //    // get current page of items
    //    this.pagedItems = list.slice(this.pager.startIndex, this.pager.endIndex + 1);
    //}

    //changePageSize(value: number) {
    //    this.setPage(1);
    //}

    private _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
}