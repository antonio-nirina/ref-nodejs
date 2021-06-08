import { Component } from '@angular/core';
//@ts-ignore
import { } from '@types/pdf';
import { Letter } from '../Models/letter';
import { Router, ActivatedRoute } from '@angular/router';

import { PrevisualiserService } from "../Services/previsualiser.service";
import { PreparationService } from '../Services/preparation.service';
import { MailingService } from '../Services/mailing.service';

import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ConfirmDialog } from '../Components/confirm-dialog.component';
import { DialogsService } from '../Services/dialogs.service';
import { ErrorDialog } from '../Components/error-dialog.component';

import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

import { MailingGroup } from '../Models/mailingGroup';
import { LetterType } from '../Models/letterType';
import { Country } from "../Models/country";

import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AuthenticationService } from '../Services/index';

import { INgxMyDpOptions, IMyDateModel, IMyOptions } from 'ngx-mydatepicker';

@Component({
	selector: 'previsualiser',
	templateUrl: './src/app/Views/Publipostage/previsualiser.component.html'
})
export class PrevisualiserComponent {

	_model: MailingGroup;
	errorMessage
	mobileOperations: boolean;
	letters: Letter[];
	// mailingGroupID: string;
	letterTypes: LetterType[];
	selectedLetter: Letter;
	letterNumber: number;
	hrefUrl: any;
	hrefName: string;
	page: number;
	binaryString: any;
	recommande: boolean;
	r1ar: boolean;
	r1: boolean;
	ecopli: boolean;
	verte: boolean;
	suivi: boolean;
	prioritaire: boolean;
	flp: boolean;
	flv: boolean;
	priceRounded: number;
	controllerName: string;
	isModelCreated: boolean;
	countries: Country[];
	redirect_route = '';
	@BlockUI() blockUI: NgBlockUI;
	ScheduledDate: any;
	estimateDateLaPoste: Date;
	dateString: string;
	isScheduled: boolean;
	showDelaySending: boolean;

	dateOptions: INgxMyDpOptions = {        
		dateFormat: 'dd-mm-yyyy',
		showTodayBtn: false,
		markCurrentDay: true,
		disableWeekends: true,
		disableUntil: { year: 0, month: 0, day: 0 },
		monthLabels: { 1: 'janv.', 2: 'févr.', 3: 'mars', 4: 'avril', 5: 'mai', 6: 'juin', 7: 'juil.', 8: 'août', 9: 'sept.', 10: 'oct.', 11: 'nov.', 12: 'déc.' },
		dayLabels: { su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam' }
	};
	

	constructor(private previsualiserService: PrevisualiserService,
		private mailingService: MailingService,
		private route: ActivatedRoute,
		private router: Router,
		private preparationService: PreparationService,
		private dialogsService: DialogsService,
		private sanitizer: DomSanitizer,
		private auth: AuthenticationService
	) {

		this.recommande = false;
		this.r1 = false;
		this.r1ar = false;
		this.ecopli = false;
		this.verte = false;
		this.suivi = false;
		this.prioritaire = false;
		this.flp = false;
		this.flv = false;
		this.priceRounded = 0;
		this.letters = Array<Letter>();
		this.selectedLetter = new Letter();
		this.letterNumber = 1;
		this.page = 1;
		this.controllerName = "previsualiser";
		this.isModelCreated = false;
		this.ScheduledDate = null;
	}

	ngOnInit() {

		this.blockUI.start();

		this.auth.observeStepHelp.next(20);

		this.preparationService.isModelCreated().subscribe(response => {
			this.isModelCreated = response;
			if (this.isModelCreated) {
				var model = null;
				var tempAddress = null;
				model = this.mailingService.getMailingGroup();
				model.subscribe(
					model => {

						this._model = new MailingGroup();
						// this._model.MailingGroupID = model.mailingGroupID;
						this._model.ColorID = model.ColorID;
						this._model.RectoVersoID = model.RectoVersoID;
						this._model.AccompColorID = model.AccompColorID;
						this._model.AccompRectoVersoID = model.AccompRectoVersoID;
						this._model.EnvelopID = model.EnvelopID;
						this._model.LetterTypeID = model.LetterTypeID;
						this._model.CSVDocumentName = model.CSVDocumentName != null ? model.CSVDocumentName : "";
						this._model.MainDocumentName = model.MainDocumentName != null ? model.MainDocumentName : "";
						this._model.SenderNotPrinted = model.SenderNotPrinted;
						this._model.PrintedEnvelope = this._model.EnvelopID > 3 ? true : false;
						this._model.PorteAdress = model.PorteAdress;
						this._model.ExtraStitched = model.ExtraStitched;
						this._model.BarCode = model.BarCode;
						this._model.SenderPresent = model.SenderPresent;
						this._model.AnnexLinked = false;
						this._model.SenderID = model.SenderID;
						this._model.AdminStatusID = model.AdminStatusID;
						this._model.PriceEstimate = Math.round((model.PriceServiceEstimate + model.PricePostOfficeEstimate) * 100) / 100;
						this._model.minNumberOfPapers = model.minNumberOfPapers;

						if (model.ScheduledDate != null) {
							this.isScheduled = true;
							this.showDelaySending = this.isScheduled;
							let date: Date = model.ScheduledDate;
							this.estimateDateLaPoste = model.ScheduledDate;
							this.ScheduledDate = {
								date: {
                                    year: new Date(date as any).getFullYear(),
                                    month: new Date(date as any).getMonth() + 1,
                                    day: new Date(date as any).getDate()
								}
							};
						}
						
												
						var documents = null;
						documents = this.preparationService.getDocuments();
						documents.subscribe(
							documents => this._model.AnnexList = documents
						)
						switch (this._model.LetterTypeID) {
							case 1: this.recommande = true;
								this.r1ar = true;
								break;
							case 2: this.recommande = true;
								this.r1 = true
								break;
							case 3: this.flp = true;
								this.prioritaire = true;
								break;
							case 4: this.verte = true;
								this.flv = true
								break;
							case 5: this.ecopli = true;
								break;
							case 6: this.suivi = true;
							default: break;
						}
					}
				);
				var letters = null;
				letters = this.previsualiserService.getPreviewLetters();
				letters.subscribe(
					letters => {
						this.letters = letters;
						if (this.letters.length > 0) {
							this.selectedLetter = this.letters[0];
							this.getLetterContent();
						}
						else {
							this.router.navigate(['/home']);
						}
					},
					error => this.errorMessage = <any>error
				);
				
				var letterTypes = null;
				letterTypes = this.preparationService.getAllLetterTypes();
				letterTypes.subscribe(
					letterType => this.letterTypes = letterType,
					error => this.errorMessage = <any>error
				);

				this.updateDates();

				this.isScheduled = false;
			}
			else {
				this.router.navigate(['/home']);
			}

			this.blockUI.stop();
		},

			error => {
				this.blockUI.stop();
			});

		var countries = null;

		countries = this.preparationService.getAllCountries();
		countries.subscribe(
			countries => {
				this.countries = countries;

			},
			error => this.errorMessage = <any>error
		);

	}

	onDateChanged(event: IMyDateModel): void {
		// date selected
	}

	next() {
		if ((this.letterNumber < 4) && (this.letterNumber < this.letters.length)) {
			this.letterNumber++;
			this.setLetter(this.letterNumber)
		}
	}
	previous() {
		if (this.letterNumber > 1) {
			this.letterNumber--;
			this.setLetter(this.letterNumber);
		}
	}
	first() {
		if (this.letters.length > 0) {
			this.letterNumber = 1;
			this.setLetter(1);
		}
	}
	last() {
		if (this.letters.length > 0) {
			this.letterNumber = this.letters.length;
			this.setLetter(this.letters.length);
		}
	}

	setLetter(num: number) {
		num--;
		this.selectedLetter = this.letters[num];
		this.getLetterContent();
	}

	getLetterContent() {
		this.blockUI.start();
		var binaryString = null;
		binaryString = this.previsualiserService.getBinaryLetter(this.selectedLetter.LetterID)
		binaryString.subscribe(
			data => {
				this.binaryString = this._base64ToArrayBuffer(data);


				var blob = new Blob([this.binaryString], {
					type: "application/pdf"
				});

				if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				this.hrefUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://publipostage.servicepostal.com/PrevisualiserFile.ashx?letterID=" + this.letterNumber + "&m=" + sessionStorage.getItem("MG"));
				} else {
					this.hrefUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
				}
				//this.hrefUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
				this.hrefName = "document_" + this.letterNumber + ".pdf";
				this.blockUI.stop();
			},

			error => {
				this.blockUI.stop();
			}
		);
	}

	private _base64ToArrayBuffer(base64) {
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	private countPapers(pages: number) {
		if (pages) {
			if (this._model.RectoVersoID == 0) {
				return pages;
			}
			else {
				let papers: number;
				let rest: number = pages % 2;
				if (rest > 0) {
					papers = (pages - 1) / 2 + 1;
				}
				else {
					papers = pages / 2;
				}
				return papers;
			}            
			
		}
	}

	setScheduleDate() {
		if (this.ScheduledDate != null) {
			let res = null;
			res = this.previsualiserService.setScheduledDate(this.ScheduledDate.formatted);
			res.subscribe(
				response => {
					if (response == "OK") {
						this.isScheduled = true;

						this.updateDates();
					}
				}
			);
		}        
	}

	cancelScheduledDate() {
		let res = null;
		res = this.previsualiserService.cancelSheduledDate();
		res.subscribe(
			response => {
				if (response == "OK") {
					this.isScheduled = false;

					this.updateDates();
				}
			}
		);
	}

	getCopyOfOptions(): IMyOptions {
		return JSON.parse(JSON.stringify(this.dateOptions));
	}


	updateDates() {
		var dateSending = null;

		dateSending = this.previsualiserService.getDateLaPoste();

		dateSending.subscribe(
			Result => {
				//this.estimateDateLaPoste = new Date(Result.date);
				this.dateString = Result.dateString;

				this.estimateDateLaPoste = Result.date;

				let copy = this.getCopyOfOptions();
				copy.disableUntil = {
					year: new Date(Result.date).getFullYear(),
					month: new Date(Result.date).getMonth() + 1,
					day: new Date(Result.date).getDate() + 1
				};
				this.dateOptions = copy;

			},
			error => this.errorMessage = <any>error
		);
	}

	//onComponentChange(value) {
		
	//    this.redirect_route = value;

	//}

	//isActive(data: any[]): boolean {
	//    return this.router.isActive(
	//        this.router.createUrlTree(data),
	//        true);
	//}

	//confirmPublipostage() {

	//    let dialogRef: MdDialogRef<ConfirmDialog>;
	//    dialogRef = this.dialogsService.confirm('Cela enverra une demande de publipostage.', 'Voulez -vous poursuivre?');
	//    var returnValue;

	//    dialogRef.afterClosed().subscribe(result => {
	//        returnValue = result;
	//        console.log('selectedOption: ' + returnValue);
	//        if (returnValue == true) {
	//            var response = null;

	//            //response = this.previsualiserService.confirmPublipostage();
	//            //response.subscribe(
	//            //    data => {
	//            //        if (data.Message == "UPDATE_SUCCESS") {
	//            //            //localStorage.removeItem("MailingGroupID");
	//            this.router.navigate(['/confirmation']);
	//            ////                }
	//            ////                else {
	//            ////                    let dialogRef: MdDialogRef<ErrorDialog>;
	//            ////                    var message = data;

	//            ////                    dialogRef = this.dialogsService.error("Une erreur est survenue! Essayez de renvoyer à nouveau publipostage", "Erreur: " + data);
	//            ////                }                        
	//            ////            }
	//            ////        )        
	//            ////    }
	//            ////    else {
	//            ////        return;
	//            ////    }
	//            ////});      
	//        }
	//    });
	//}
}
