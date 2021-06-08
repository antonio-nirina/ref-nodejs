import { Component, NgZone, Inject, Injectable, EventEmitter, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, HostListener, ApplicationRef, ChangeDetectorRef, Pipe, PipeTransform, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { CountdownService, countdownOptions, countdownData, CountdownComponent } from 'ng2-countdown/index';
import { PopoverModule } from 'ngx-popover';
import { NgDraggableModule } from 'angular-draggable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockWithProgress } from './BlockWithProgress.component';
import { TreeviewConfig, TreeviewItem } from 'ng2-dropdown-treeview';
import { User } from "../Models/user";
import { AddressGroup } from "../Models/addressGroup";
import { CommonModule } from "@angular/common";

import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/pairwise';
import { Subscription } from 'rxjs/Subscription';
import { PreparationService } from "../Services/preparation.service";
import { TempAddressService } from "../Services/tempAddress.service";
import { MailingService } from "../Services/mailing.service";
import { MonCompteService } from "../Services/moncompte.service";
import { CountdownMessageService } from "../Services/countdownMessage.service";
import { AddressService } from "../Services/addresses.service";
import { MailingGroup } from "../Models/mailingGroup";
import { Document } from "../Models/document";
import { Step, AddressesModalState } from "../Models/Step";
import { LetterType } from "../Models/letterType";
import { TempAddress } from "../Models/tempAddress";
import { Country } from "../Models/country";
import { DocumentVariable } from "../Models/documentVariable";
import { AdditionalCSVHeader } from "../Models/additionalCSVHeader";
import { ValueCSVHeader } from "../Models/valueCSVHeader";
import { MandatoryHeader } from "../Models/mandatoryHeader";
import { HeaderMapper } from "../Models/HeaderMapper";
import { Tab } from "../Tab/tab";
import { Tabs } from "../Tab/tabs";
import { IncorrectAddress } from "./incorrectAddress.component";
import { CustomField } from './customField.component';
import { MonMailing } from "./monMailing.component";
import { CountdownCustomComponent } from "./countdownCustom.component";
import { LoginCompleteComponent } from "./loginComplete.component";
import { SortableDirective } from '../Directives/sortable.directive';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import * as _ from 'underscore';
//import * as _ from 'lodash';
import { PagerService } from '../services/pager.service';
import { SharedService } from '../Services/shared.service';
import { Address } from "../Models/address";


import { CountryPipe } from "../Pipes/country";
import { LetterTypePipe } from "../Pipes/letterType";
import { VariablePipe } from "../Pipes/variable";
import { AuthenticationService } from '../Services/index';
import { DialogsService } from '../Services/dialogs.service';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ConfirmDialog } from '../Components/confirm-dialog.component';
import { ErrorDialog } from '../Components/error-dialog.component';
import { AppConfig } from '../app.config';



declare var componentHandler: any;
declare var $: any;
var configurationGlobal = new AppConfig();

const urlTmpl = configurationGlobal.apiUrl + 'api/File/template';
const urlAdr = configurationGlobal.apiUrl + 'api/File/address';
const urlDoc = configurationGlobal.apiUrl + 'api/File/document';

@Component({
	moduleId: module.id,
	selector: 'home',
	templateUrl: '../Views/Publipostage/home.component.html',
	providers: [MailingGroup, PagerService, MonMailing, User]
})



export class HomeComponent implements OnChanges {
	indices = this._model.AnnexList;
	order = [...this.indices];

	orderChanged(order) {
		this.order = order;
	}

	@ViewChild(Tabs) tabsComponent: Tabs;

	@ViewChildren(Tab) tabs: QueryList<Tab>;

	@ViewChild('uploadTemplatebutton') uploadTemplatebuttonElRef: ElementRef;

	@ViewChild('uploadfilebutton') uploadfilebuttonElRef: ElementRef;

	@ViewChild('uploadTemplatebutton3') uploadTemplatebutton3ElRef: ElementRef;

	@ViewChild('closeModal') closeModal: ElementRef;

	@ViewChild('dl') dl: ElementRef;
	@ViewChild('c5') c5: ElementRef;

	@BlockUI() blockUI: NgBlockUI;

	hideOkMessageAdr: boolean;
	hideErrorMessageAdr: boolean;
	errorMessageAdr: string;

	AddressesModalState: typeof AddressesModalState = AddressesModalState;

	currentAMState: AddressesModalState;
	previousAMState: AddressesModalState;

	addressGroups: AddressGroup[];
	addressGroupsSelected: number[];
	addressGroupsMultiselectItems: TreeviewItem[];
	addressGroupsMultiselectValues: any[];

	configAddressGroup: TreeviewConfig = {
		isShowAllCheckBox: false,
		isShowFilter: false,
		isShowCollapseExpand: true,
		maxHeight: 500
	};

	totalSelectedAddresses: number;

	senderAddresses: Address[];

	mandatoryHeaders: MandatoryHeader[];


	//**Page properties
	modelIsCreated: boolean;
	hideAdvanceOptions: boolean;
	hideAdvanceOptionsSideBar: boolean;
	hideNonCustomDoc: boolean;
	showDocumentOptions: boolean;
	showAnnexOptions: boolean;
	errorMessage: string;
	letterTypes: LetterType[];
	incorrectAddresses: TempAddress[];
	numberOfCorrectAddresses: number;
	correctAddress: TempAddress[];
	previewAddress: TempAddress[];
	variables: DocumentVariable[];
	headersWithExamples: AdditionalCSVHeader[];
	message: string;
	selectedTab: Tab;
	countries: Country[];
	destinationCountrySelected: Country;
	IncorrectCountry: Country;
	customHeaders: AdditionalCSVHeader[];
	addressForm: FormArray;
	customFieldsForm: FormArray;
	addressesHasError: boolean;
	hideAddressListModal: boolean;
	showUpload: boolean;
	showImporter: boolean;
	hideProgress: boolean;
	showMobileMenu: boolean;
	showMobileSidebar: boolean;
	countdownMessage: string;
	timeoutInterval: number;
	tempAddressesForAddressGroups: TempAddress[];
	customHeadersForAddressGroups: AdditionalCSVHeader[];
	customHeadersValuesValid: boolean;
	maxLenghtCustomField: number;
	binaryString: any;
	hrefUrl: any;
	hrefName: string;
	loading: boolean;
	newSenderAddress: Address;
	senderAddress: Address;
	noSender: boolean;

	hideAfterShowingAdresses: boolean;
	//progressBarPrev prop
	hiddenProgressBarPrev: boolean;
	progressActivePrev: boolean;
	progressPercentagePrev: number;
	sizeLimit: number;
	files: UploadFile[];
	uploadInputAdr: EventEmitter<UploadInput>;
	uploadInputTmpl: EventEmitter<UploadInput>;
	uploadInputDoc: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	filesAdr: UploadFile[];
	//uploadInputAdr: EventEmitter<UploadInput>;
	humanizeBytesAdr: Function;
	dragOverAdr: boolean;
	filesDoc: UploadFile[];
	//uploadInputDoc: EventEmitter<UploadInput>;
	humanizeBytesDoc: Function;
	dragOverDoc: boolean;
	value: any;
	dialogResponse: any;
	responseUpd: any;
	stopPropagationTmpl: boolean;
	stopPropagationAdr: boolean;
	stopPropagationDoc: boolean;
	//hildOutput: UploadOutput;
	documentNum: number;
	currentFile: UploadFile;
	controllerName: string;
	previousUrl: string;
	steps: Step[];
	importerStep: boolean;
	pager: any = {};
	pagedItems: TempAddress[];
	pageSize: number;
	totalTempAddressesForGroups: number;
	askForSender: boolean;
	page: number;
	askToFillInCustomFields: boolean;
	senderChanged: boolean;// <<<<<<<<>>>>>>>>
	incorrectAddressesToBeFixed: boolean;
	//addressesImportComplete: boolean;
	senderActivelyEmpty: boolean; //<<<<<<<>>>>>>>
	addressesModalLocked: boolean;
	totalNumberOfPapers: number;
	numberOfInternationalDestinations: number;
	allHeaders: AdditionalCSVHeader[];
	mappers: HeaderMapper[];
	headerValidation: string[];
	ShowLoginInside: boolean;
	event: boolean;
	arrangedCsvFile: any;
	countriesMapping: Country[];
	countriesListNewSender: Country[];
	countrySender: Country;
	countryIncorrect: Country;
	countryMapping: Country;
	optionsPristine: boolean;
	isEdge: boolean;

	constructor(private preparationService: PreparationService,
		private tempAddressService: TempAddressService,
		private mailingService: MailingService,
		private countdownMessageService: CountdownMessageService,
		@Inject(NgZone) private zone: NgZone,
		private _model: MailingGroup,
		private _fb: FormBuilder,
		private changeDetector: ChangeDetectorRef,
		private _countdownService: CountdownService,
		private pagerService: PagerService,
		private router: Router,
		private _sharedService: SharedService,
		private dialogsService: DialogsService,
		private dialog: MdDialog,
		private addressService: AddressService,
		private monCompteService: MonCompteService,
		private auth: AuthenticationService,
		private _modelUser: User,

		private sanitizer: DomSanitizer
	) {

		this.pageSize = 10;
		this.senderActivelyEmpty = false;
		this.askForSender = false;
		this.importerStep = false;
		this.optionsPristine = true;

		//let hashedID: string = localStorage.getItem("MailingGroupID");

		//this.modelIsCreated = hashedID == null ? false : true;
		//Check if model is created by getting session value and returning mailingID
		this.preparationService.isModelCreated().subscribe(response => {
			this.modelIsCreated = response;

			if (this.modelIsCreated) {
				var model = null;
				var tempAddress = null;
				model = this.mailingService.getMailingGroup();
				model.subscribe(
					model => {
						if (model != null) {
							this._model = new MailingGroup();
							this._model.MailingGroupID = model.MailingGroupID;
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
							this._model.SenderID = model.SenderID;
							this._model.AdminStatusID = model.AdminStatusID;
							this._model.PriceEstimate = model.PriceServiceEstimate + model.PricePostOfficeEstimate;
							this._model.SenderPresent = model.SenderPresent;
							this._model.AnnexLinked = model.AnnexLinked;
							this.optionsPristine = false;


							if (this._model.AdminStatusID > 8) {
								this.addressesModalLocked = true;
								//this.addressesImportComplete = true;
								this.steps = new Array<Step>();
								this.addStepToListOfSteps(true, AddressesModalState.COMPLETED, false);

								var tempAddresses = null;
								tempAddresses = this.tempAddressService.GetTempAddresses();
								tempAddresses.subscribe(
									tempAddresses => {
										this.tempAddressesForAddressGroups = tempAddresses;
										this.totalSelectedAddresses = this.tempAddressesForAddressGroups.length;

									},
									error => this.errorMessage = <any>error
								);

								if (this._model.CSVDocumentName && this._model.CSVDocumentName != '') {
									this.importerStep = true;
									this.hideAfterShowingAdresses = true;
								}

								this.senderActivelyEmpty = !this._model.SenderPresent;
								if (this.importerStep == true && (this.senderActivelyEmpty || (this._model.SenderID && this._model.SenderID != -1))) {
									this.askForSender = true;
								}

								if (this._model.SenderID != null && this._model.SenderID > 0) {
									var senderAddress = null;

									senderAddress = this.addressService.getSender();
									senderAddress.subscribe(
										address => {
											this.senderAddress = address;
										},
										error => this.errorMessage = <any>error
									);
								}
							}
							else {
								this.addressesModalLocked = false;
								this.resetSteps();
							}

							var documents = null;
							documents = this.preparationService.getDocuments();
							documents.subscribe(
								documents => {
									this._model.AnnexList = documents;
								},
								error => this.errorMessage = <any>error
							);

							tempAddress = this.tempAddressService.getAddressPreview();
							tempAddress.subscribe(
								tempAddress => {
									this.previewAddress = tempAddress;
								},
								error => this.errorMessage = <any>error
							);
						}
						else {
							this._model = new MailingGroup();
							this.addressesModalLocked = false;
							this.resetSteps();

							this.auth.isLoginSubject.subscribe(
								(value: boolean) => {
									if (value == true) {
										this.getPreferences();


									}
								}
							);
						}
					}
				);

			}
			else {
				this._model = new MailingGroup();
				this.addressesModalLocked = false;
				this.resetSteps();

				this.auth.isLoginSubject.subscribe(
					(value: boolean) => {
						if (value == true) {
							this.getPreferences();


						}
					}
				);

			}
		});

		this.sizeLimit = 67108864;
		this.files = []; // local uploading files array
		this.uploadInputAdr = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
		this.uploadInputTmpl = new EventEmitter<UploadInput>();
		this.uploadInputDoc = new EventEmitter<UploadInput>();
		this.humanizeBytes = humanizeBytes;
		this.filesAdr = [];
		this.humanizeBytesAdr = humanizeBytes;
		this.filesDoc = [];
		this.humanizeBytesDoc = humanizeBytes;
		this.stopPropagationTmpl = true;
		this.stopPropagationAdr = true;
		this.stopPropagationDoc = true;
		this.currentAMState = AddressesModalState.NOT_INITIALIZED;
		this.previousAMState = AddressesModalState.NOT_INITIALIZED;
		//this.getSenderAddresses();

		this.previewAddress = new Array<TempAddress>();

		this.incorrectAddresses = new Array<TempAddress>();
		this.numberOfCorrectAddresses = 0;
		this.hideOkMessageAdr = true;
		this.hideErrorMessageAdr = true;
		this.showUpload = false;
		this.showImporter = false;
		this.hideAdvanceOptions = false;
		this.hideAdvanceOptionsSideBar = false;
		this.hideNonCustomDoc = false;
		this.showDocumentOptions = false;
		this.showAnnexOptions = false;
		this.hideAddressListModal = true;
		this.hideProgress = true;
		this.showMobileMenu = true;
		this.showMobileSidebar = true;
		this.countdownMessage = "";
		this.initCountdown();
		this.hiddenProgressBarPrev = true;
		this.progressActivePrev = false;
		this.progressPercentagePrev = 0;
		this.controllerName = 'home';
		this.totalSelectedAddresses = 0;
		this.incorrectAddressesToBeFixed = false;
		this.numberOfInternationalDestinations = 0;
		this.senderChanged = false;
		this.askToFillInCustomFields = false;
		//this.addressesImportComplete = false;
		this.totalNumberOfPapers = 0;
		this.hrefUrl = null;
		this.newSenderAddress = new Address();
		this.ShowLoginInside = false;
		this.customHeadersValuesValid = true;
		this.maxLenghtCustomField = 50;


		var countdownOptions: countdownOptions = {
			format: "h/m/s",
			onStart: (countdown: countdownData) => {

			},
			onComplete: function (countdown: countdownData) {

			}
		}
		_countdownService.setCoundownOptions(countdownOptions);
	}

	ngOnInit() {

		this.blockUI.start();
		//if (this.auth.loggedIn()) {
		//    this.getSenderAddresses();
		//    this.auth.startupTokenRefresh();
		//}
		//else
		//{
		//    this.ResetMailingGroup();
		//}
		var ua = window.navigator.userAgent;
		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			this.isEdge = true;
		}
		else {
			this.isEdge = false;
		}

		$(".meter > span").each(function () {
			$(this)
				.data("origWidth", $(this).width())
				.width(0)
				.animate({
					width: $(this).data("origWidth") // or + "%" if fluid
				}, 1200);
		});


		if ($("#sticky-component").length) {
			$("#sticky-component").affix({
				offset: { top: 110, bottom: 300 }
			});
		}

		if (!this.modelIsCreated) {
			this._model = new MailingGroup();
		}

		var letterTypes = null;


		letterTypes = this.preparationService.getAllLetterTypes();
		letterTypes.subscribe(
			letterType => this.letterTypes = letterType,
			error => this.errorMessage = <any>error
		);

		var countries = null;

		countries = this.preparationService.getAllCountries();
		countries.subscribe(
			countries => {
				this.countries = countries;
				let country = new Country();
				country.CountryID = 0;
				country.CountryName = "- Choisissez le pays -";
				this.countries.unshift(country);

			},
			error => this.errorMessage = <any>error
		);

		this.getCountries();

		this.addressForm = new FormArray([]);
		this.customFieldsForm = new FormArray([]);

		var countdownMsg = null;

		countdownMsg = this.countdownMessageService.getCountdownMessage();
		countdownMsg.subscribe(
			countdownMsg => this.countdownMessage = countdownMsg,
			error => this.errorMessage = <any>error
		);


		this.auth.isLoginSubject.subscribe(
			(value: boolean) => {

				if (value == true) {
					if (this._model.SenderID != null && this._model.SenderID > 0) {
						var addSenderToUser = null;

						addSenderToUser = this.addressService.addSenderToUser();
						addSenderToUser.subscribe(
							addSenderToUser => {
								this.getSenderAddresses();
							},
							error => this.errorMessage = <any>error
						);
					}
					else {
						this.getSenderAddresses();
					}

					if (this.optionsPristine == true) {
						this.preparationService.isModelCreated().subscribe(response => {
							this.modelIsCreated = response;
							if (!this.modelIsCreated) {

								this.getPreferences();

							}
							else {
								var model = null;
								model = this.mailingService.getMailingGroup();
								model.subscribe(
									model => {
										if (model == null) {
											this.getPreferences();
										}
									},
									error => this.errorMessage = <any>error
								);
							}
						});
					}

				}
				else if (this._model.SenderID != null && this._model.SenderID > 0) {
					var copySender = null;

					copySender = this.addressService.copySender();
					copySender.subscribe(
						copySender => {
							if (copySender != null) {
								this._model.SenderID = copySender;
								var newSenderAddress = null;

								newSenderAddress = this.addressService.getSender();
								newSenderAddress.subscribe(
									address => {
										this.newSenderAddress = address;
									},
									error => this.errorMessage = <any>error
								);
							}
						},
						error => this.errorMessage = <any>error
					);
				}
			}
		);
		this.blockUI.stop();
	}

    savelink(link) {
        this._sharedService.changeMessage(link);
    }

	mouseEnterUpload() {
		$('.select-action-import').addClass('grey-action');
	}
	mouseEnterImport() {
		$('.select-action-upload').addClass('grey-action');
	}
	mouseLeaveUpload() {
		$('.select-action-import').removeClass('grey-action');
	}
	mouseLeaveImport() {
		$('.select-action-upload').removeClass('grey-action');
	}

	changeHeaders(event) {
		this.mandatoryHeaders = event;
	}

	changeListMandatory(event) {
		this.mappers = event;
	}

	changeVariables(event) {
		this.variables = event;
	}

	setSender(event) {
		this.newSenderAddress = event;
		if (this.newSenderAddress != null) {
			this.updateSender(this.newSenderAddress.AddressID);
		}
		else {
			this.updateSender(null);
		}
	}

	initCountdown() {
		var currentdate = new Date();
		//change this line for testing different times, also in the preparation controller
		this.timeoutInterval = (17 * 60 + 30) * 60 - (((currentdate.getHours() * 60 + currentdate.getMinutes()) * 60 + currentdate.getSeconds()));
		if (this.timeoutInterval < 0) {
			this.timeoutInterval = 0;
		}
	}
	onStart(countdown: countdownData) {

	}
	onComplete(countdown: countdownData) {

		var countdownMsg = null;
		countdownMsg = this.countdownMessageService.getCountdownMessage();
		countdownMsg.subscribe(
			countdownMsg => this.countdownMessage = countdownMsg,
			error => this.errorMessage = <any>error
		);
	}
	countdownEndedMessage() {

	}

	public clearIncorrectFormArray() {
		this.addressForm.controls = [];
	}

	addStepToListOfSteps(isActive: boolean, state: AddressesModalState, onlyImport: boolean) {
		let alreadyAdded = false;
		for (var i = 0; i < this.steps.length; i++) {
			this.steps[i].isActive = false;
		}

		for (var i = 0; i < this.steps.length; i++) {
			if (this.steps[i].state == state) {
				this.steps[i].isActive = true;
				alreadyAdded = true;
			}
		}

		if (alreadyAdded == false) {
			let step = new Step();
			step.isActive = isActive;
			step.state = state;
			step.onlyimport = onlyImport;
			this.steps.push(step);
		}
		this.returnActiveStepIndex()
	}

	setAsActiveStep(index: number): boolean {

		for (var i = 0; i < this.steps.length; i++) {
			this.steps[i].isActive = false;
		}
		if (this.steps != null) {
			if (index <= this.steps.length) {
				this.steps[index].isActive = true;

				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}


	}

	returnActiveStep(): Step {
		let activestep = null;
		if (this.steps != null) {
			for (var i = 0; i < this.steps.length; i++) {
				if (this.steps[i].isActive == true) {
					activestep = this.steps[i];
					if (activestep.state && this.auth.observeStepHelp.value != activestep.state) {
						this.auth.observeStepHelp.next(activestep.state);
					}
					break;
				}
			}
		}
		return activestep;
	}

	returnActiveStepIndex(): number {
		let activestep = null;
		let index = -1;
		if (this.steps != null) {
			for (var i = 0; i < this.steps.length; i++) {
				if (this.steps[i].isActive == true) {
					activestep = this.steps[i];
					index = i;
					break;
				}
			}
			return i;
		}
		else return -5;

	}

	getCountries() {
		var countriesSender = null;

		countriesSender = this.preparationService.getAllCountries();
		countriesSender.subscribe(
			countries => {
				this.countriesListNewSender = countries;
				let country = new Country();
				country.CountryID = 0;
				country.CountryName = "- Choisissez le pays -";
				this.destinationCountrySelected = country;
				//this.countrySender = country;
				this.countryIncorrect = country;
				this.countriesListNewSender.unshift(country);

			},
			error => this.errorMessage = <any>error
		);

		var countriesMapping = null;

		countriesMapping = this.preparationService.getAllCountries();
		countriesMapping.subscribe(
			countries => {
				this.countriesMapping = countries;
				let country = new Country();
				country.CountryID = 0;
				country.CountryName = "- Etat à partir de l'adresse -";
				this.countryMapping = country;
				this.countriesMapping.unshift(country);

			},
			error => this.errorMessage = <any>error
		);
	}

	removeAllImportSteps() {
		let arrayIndexes = new Array<number>();
		let newArray = this.steps.filter(x => x.onlyimport == false);
		this.steps = newArray;
	}

	removeAllSelectSteps() {
		let arrayIndexes = new Array<number>();
		let newArray = this.steps.filter(x => x.onlyimport == true || x.state == 3 || x.state == 5);

		this.steps = newArray;
	}

	removeAllStepsOverCurrentActive() {
		let indexActive = this.returnActiveStepIndex();
		if (this.steps != null) {
			var newArray = this.steps.filter(function (elem, index, array) {
				return index <= indexActive;
			});
		}

		this.steps = newArray;
	}

	removeOneStepFromList(stateNumber) {
		let arrayIndexes = new Array<number>();
		let newArray = this.steps.filter(x => x.state != stateNumber);

		this.steps = newArray;
	}

	goBack(): Step {
		let stepsBack = 1;
		if (this.returnActiveStep().state == 2) {
			stepsBack = 2;
		}

		if ((this.returnActiveStep().state == 1 || this.returnActiveStep().state == 2) && this.returnActiveStep().onlyimport == true) {
			if (this.incorrectAddressesToBeFixed == false) {
				if (this.checkIfStateInTheList(8)) {
					this.removeOneStepFromList(8);
				}
			}
		}

		let index = this.returnActiveStepIndex();
		if (index - stepsBack >= 0) {
			this.setAsActiveStep(index - stepsBack);
			return this.steps[index - stepsBack];
		}
		else return null;
	}

	checkIfStateInTheList(stateNumber): boolean {
		if (this.steps && this.steps.length > 0) {
			for (var i = 0; i < this.steps.length; i++) {
				if (this.steps[i].state == stateNumber) {
					return true;
				}
			}
		}
		return false;
	}

	setLetterType(typeIndex) {
		this._model.LetterTypeID = this.letterTypes[typeIndex].LetterTypeID;
	}

	showUploader() {
		this.auth.getUser()
			.subscribe((response) => {
				this._modelUser = JSON.parse(response._body);
				this.removeAllSelectSteps();
				//if (this.importerStep == false) {
				//	if (this._model.CSVDocumentName == '') {
				//		let message = this.tempAddressService.deleteTempAddresses();

				//		message.subscribe(
				//			message => {
				this.previewAddress = new Array<TempAddress>();
				this.addressGroups = new Array<AddressGroup>();
				this.addressGroupsMultiselectItems = new Array<TreeviewItem>();
				this.customHeaders = new Array<AdditionalCSVHeader>();
				this.customHeadersForAddressGroups = new Array<AdditionalCSVHeader>();
				this.tempAddressesForAddressGroups = new Array<TempAddress>();
				let status = null;
				status = this.preparationService.setInitializeStatus();
				status.subscribe(response => {
					if (response != null) {
						this._model.AdminStatusID = response.AdminStatusID;
						this.senderActivelyEmpty = false;
						this.numberOfInternationalDestinations = 0;
						this.importerStep = true;
						this.addStepToListOfSteps(true, AddressesModalState.UPLOAD_FILE, true);
					}
				});

				//			},
				//			error => this.errorMessage = <any>error
				//		);

				//		message.subscribe(
				//			message => {
				//				this.previewAddress = new Array<TempAddress>();
				//				this.addressGroups = new Array<AddressGroup>();
				//				this.addressGroupsMultiselectItems = new Array<TreeviewItem>();
				//				this.customHeaders = new Array<AdditionalCSVHeader>();
				//				this.customHeadersForAddressGroups = new Array<AdditionalCSVHeader>();
				//				this.tempAddressesForAddressGroups = new Array<TempAddress>();
				//                            var status = null;
				//                            status = this.preparationService.setInitializeStatus();
				//                            status.subscribe(response => {
				//                                if (response != null) {
				//                                    this._model.AdminStatusID = response.AdminStatusID;
				//                                    this.senderActivelyEmpty = false;
				//                                    this.numberOfInternationalDestinations = 0;
				//                                    this.importerStep = true;
				//                                    this.addStepToListOfSteps(true, AddressesModalState.UPLOAD_FILE, true);
				//                                }
				//                            });

				//	}
				//	else {
				//		this.importerStep = true;
				//		this.addStepToListOfSteps(true, AddressesModalState.UPLOAD_FILE, true);

				//	}

				//}
				//else {
				//	this.importerStep = true;
				//	this.addStepToListOfSteps(true, AddressesModalState.UPLOAD_FILE, true);
				//}
			},
			error => this.errorMessage = <any>error
			);



	}

	showChooseGroups() {
		var isLogged = null;
		isLogged = this.auth.serverCheckIsLogged().take(1);
		isLogged.subscribe(
			response => {
				if (response["IsLoggedIn"] == "true") {

					//this._modelUser = JSON.parse(localStorage.getItem('currentUser'));
					this.auth.getUser()
						.subscribe((response) => {
							this._modelUser = JSON.parse(response._body);
							let s = this.returnActiveStep();
							if (s && s.state == AddressesModalState.SELECT_GROUPS) {
								if (this.importerStep == true) {
									this.removeAllImportSteps();
								}

								if (this._model.CSVDocumentName != '' && this.importerStep == true) {
									//same as in this.removeDocument('address') but different thing happens after deleteTempAddresses returns
									this.askToFillInCustomFields = false;
									this.askForSender = false;
									this.senderActivelyEmpty = false;
									this.incorrectAddressesToBeFixed = false;
									this._model.SenderID = -1;
									this.newSenderAddress = new Address();
									this._model.SenderPresent = false;
									this.numberOfInternationalDestinations = 0;
									this.senderChanged = false;
									this._model.CSVDocumentName = '';
									this.incorrectAddresses = new Array<TempAddress>();
									this.clearIncorrectFormArray();
									this.hideErrorMessageAdr = true;
									this.hideOkMessageAdr = true;
									this.filesAdr.pop();
									this.customHeaders = new Array<AdditionalCSVHeader>();
									this.customHeadersForAddressGroups = new Array<AdditionalCSVHeader>();
									this.previewAddress = new Array<TempAddress>();
									this.totalSelectedAddresses = 0;
									this.tempAddressesForAddressGroups = new Array<TempAddress>();
									var status = null;
									status = this.preparationService.setInitializeStatus();
									status.subscribe(response => {
										if (response != null) {
											this._model.AdminStatusID = response.AdminStatusID;
											let message = this.tempAddressService.deleteTempAddresses();
											message.subscribe(
												message => {
													this.createAdditionalCSVHeadersFromVariables();
												},
												error => this.errorMessage = <any>error
											);

											this._model.IsMapped = false;
											response = this.mailingService.updateMailing(this._model);
											response.subscribe(
												response => {

												});
											this.filesAdr = new Array<UploadFile>();
										}
									});

									//**************************************
								} else {
									if (this.customHeadersForAddressGroups == undefined || this.customHeadersForAddressGroups.length < 1) {
										this.createAdditionalCSVHeadersFromVariables();
									}
								}

								this.previewAddress = new Array<TempAddress>();
								this.importerStep = false;
							}

							if (this.addressGroups == null || this.addressGroups.length == 0) {
								this.getAddressGroups();
							}
							this.addStepToListOfSteps(true, AddressesModalState.SELECT_GROUPS, false);
						},
						error => this.errorMessage = <any>error
						);


				}
			}
		)

	}

	showMappHeaders() {

		this.blockUI.start();
		let response = null;
		if (!this._model.IsMapped) {
			response = this.preparationService.autoMappHeaders();
			response.subscribe(response => {
				if (response != null) {
					this.mandatoryHeaders = response["MandatoryHeaders"];
					this.mappers = response["Mappers"];
					this.variables = response["DocumentVariables"];
					this.headersWithExamples = response["HeadersWithExamples"];
					this.numberOfInternationalDestinations = response["NumberOfInternationalDestinations"];
					this.addStepToListOfSteps(true, AddressesModalState.MAPP_HEADERS, true);
					if (!(this._model.LetterTypeID == 1 || this._model.LetterTypeID == 3)) {
						this.countriesMapping = this.countriesMapping.filter((country: Country) => country.CountryID == 1 || country.CountryID == 0);
						this.countriesListNewSender = this.countriesListNewSender.filter((country: Country) => country.CountryID == 1 || country.CountryID == 0);
					}
					else {
						this.getCountries();
					}
					this.countryIncorrect = this.countriesListNewSender.find(x => x.CountryID == 0);
					this.destinationCountrySelected = this.countriesMapping.find(x => x.CountryID == 0);

					this.blockUI.stop();
				}
			});
		}
		else {
			response = this.preparationService.getMappedHeaders();
			response.subscribe(response => {
				if (response != null) {
					this.mappers = response["Mappers"];
					this.headersWithExamples = response["HeadersWithExamples"];
					this.variables = response["DocumentVariables"];
					this.addStepToListOfSteps(true, AddressesModalState.MAPP_HEADERS, true);
					this.blockUI.stop();
				}
			});
		}
	}

	variablesCheck(mapper: HeaderMapper) {
		let vars = this.variables.find(x => x.AdditionalCSVHeaderID == mapper.Header.AdditionalCSVHeaderID);
		if (vars == null) {
			return false;
		}
		else {
			return true;
		}
	}

	findMandatoryName(mapper) {
		return this.mandatoryHeaders.find(x => x.MandatoryHeaderID == mapper.MandatoryHeaderID).MandatoryHeaderName;
	}

	private transformToLink(internationalFile) {
		if (internationalFile != null) {
			this.binaryString = this._base64ToArrayBuffer(internationalFile);
			var blob = new Blob([this.binaryString], {
				type: "text/plain"
			});
			this.hrefUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

			return this.hrefUrl;
		}

	}

	showSender() {
		let s = this.returnActiveStep();

		this.addStepToListOfSteps(true, AddressesModalState.SELECT_SENDER, false);
	}

	showSenderImport() {
		var response = null;
		this.blockUI.start();

		response = this.preparationService.checkMapping(this.destinationCountrySelected);
		response.subscribe(response => {
			if (response == null) {
				if (this.askForSender == true) {
					this.addStepToListOfSteps(true, AddressesModalState.SELECT_SENDER, true);
					this.blockUI.stop();
				}
				else {
					this.showStepAfterSenderChoice();
					this.hideAfterShowingAdresses = true;
				}
			}
			else {
				this.headerValidation = response["ValidationMessages"];
				if (this.headerValidation != null && this.headerValidation.length > 0) {
					this.blockUI.stop();
				}
				else {
					this.blockUI.stop();
					if (response["IsValid"] == true) {
						this.hiddenProgressBarPrev = false;
						this.hideAfterShowingAdresses = true;
						var mappingProgress = Observable.interval(1000).subscribe(x => {
							this.mailingService.mappingProgressStatus().subscribe((res) => {

								if (res.PercentComplete == null || res.PercentComplete == 100) {

								}
								else {
									this.progressActivePrev = true;
									this.progressPercentagePrev = res.PercentComplete;
								}
								if (res.PercentComplete == 100) {
									mappingProgress.unsubscribe();
									this.progressPercentagePrev = 100;

									this._model.IsMapped = true;
									let senderImported: boolean = res["SenderImported"];
									this.askForSender = !res["SenderImported"];
									this._model.SenderPresent = senderImported;
									this.updateModel(false);

									if (this.askForSender == true) {
										if (this._model.SenderID != null && this._model.SenderID > 0) {

											var isLogged = null;
											isLogged = this.auth.serverCheckIsLogged().take(1);
											isLogged.subscribe(
												response => {
													if (response["IsLoggedIn"] == "true") {
														this.addStepToListOfSteps(true, AddressesModalState.SELECT_SENDER, true);
														this.blockUI.stop();
													}
													else {
														var newSenderAddress = null;

														newSenderAddress = this.addressService.getSender();
														newSenderAddress.subscribe(
															address => {
																this.newSenderAddress = newSenderAddress;
																this.addStepToListOfSteps(true, AddressesModalState.SELECT_SENDER, true);
																this.blockUI.stop();
															},
															error => this.errorMessage = <any>error
														);
													}
												}
											)
										}
										else {
											this.addStepToListOfSteps(true, AddressesModalState.SELECT_SENDER, true);
											this.blockUI.stop();
										}
									}
									else {
										this.showStepAfterSenderChoice();
									}

									this.hiddenProgressBarPrev = true;
									this.progressPercentagePrev = 0;
								}
							});
						});
					}
				}
			}

		});
	}

	checkAddresses(): boolean {
		var tempAddress = null;
		tempAddress = this.tempAddressService.getIncorrectAddress();
		return tempAddress.flatMap(
			tempAddress => {
				this.incorrectAddresses = tempAddress;
				let lenght = this.incorrectAddresses.length;
				if (this.incorrectAddresses.length == 0) {
					return true;
				}
				else {
					return false;
				}
			},
			error => { this.errorMessage = <any>error; return false; }
		);
		//return false;
	}

	checkIfActivelyEmpty() {
		if (this._model.SenderID == -1) {
			this.senderActivelyEmpty = true;
			if (this._model.SenderNotPrinted == false) {
				this._model.SenderNotPrinted = true;
				this.updateModel(false);
			}
		}
		else {
			this.senderActivelyEmpty = false;
		}
	}

	showStepAfterSenderChoice() {
		if (!this.auth.userLoggedIn && this.noSender) {
			this._model.SenderID = -1;
		}
		if (this.importerStep == false) {
			this.blockUI.stop();

			if ((this._model.SenderID != null && this._model.SenderID != -1) || (this._model.LetterTypeID != 1 && this._model.LetterTypeID != 2)) {
				this.checkIfActivelyEmpty();

				if (this.tempAddressesForAddressGroups == null || this.tempAddressesForAddressGroups.length == 0) {
					var tempAddresses = null;

					this.blockUI.start();
					tempAddresses = this.tempAddressService.CreateAndGetTempAddressesFromGroups(_.uniq(this.addressGroupsMultiselectValues), this._model.SenderID);
					tempAddresses.subscribe(
						tempAddresses => {
							while (this.customFieldsForm.controls.length != 0) {
								this.customFieldsForm.controls.splice(0, 1);
                            }
                            this.addressesModalLocked = true;
							this.tempAddressesForAddressGroups = tempAddresses;
							if (this.customHeadersForAddressGroups.length == 0) {
								this.showPreviewStep();
							}
							else {
								this.initCustomHeadersValues();
								this.showFillInStep();
							}
						},
						error => this.errorMessage = <any>error
					);
				} else {
					if (this.customHeadersForAddressGroups.length == 0) {
						this.showPreviewStep();
					}
					else {
						this.showFillInStep();
					}
				}
			}
		}
		else {
			this.blockUI.start();
			if (this.askForSender == true) {
				this.checkIfActivelyEmpty();

				if (this.senderChanged == true) {

					this.senderChanged = false;
					this.getIncorretAddreses();

					////sender not imported. Update temporary addresses with selected sender
					//var response = null;

					//response = this.tempAddressService.UpdateTempAddressesAddSender(this._model.SenderID);
					//response.subscribe(
					//	response => {
					//		this.senderChanged = false;
					//		this.getIncorretAddreses();
					//	},
					//	error => this.errorMessage = <any>error
					//);
				} else {
					this.getIncorretAddreses();
                }
			}
			else {
				this.getIncorretAddreses();
            }
		}
	}

	getIncorretAddreses() {
		if (this.incorrectAddressesToBeFixed == true) {

			var tempIncorrectAddress = null;
			tempIncorrectAddress = this.tempAddressService.getIncorrectAddress();
			tempIncorrectAddress.subscribe(
				tempIncorrectAddress => {
					this.incorrectAddresses = tempIncorrectAddress;

					if (tempIncorrectAddress.length == 0) {
						var numberOfCorrectAddresses = null;
						numberOfCorrectAddresses = this.tempAddressService.GetNumberOfCorrectAddresses();
						numberOfCorrectAddresses.subscribe(
							numberOfCorrectAddresses => {
								this.totalSelectedAddresses = numberOfCorrectAddresses;
								this.ifAnyIncorrectAddresses();
							},
							error => { this.errorMessage = <any>error; return false; }
						);
					}
					else {
						this.ifAnyIncorrectAddresses();
					}

				},
				error => { this.errorMessage = <any>error; return false; }

			);
		} else {
			this.ifAnyIncorrectAddresses();
		}
	}

	ifAnyIncorrectAddresses() {
		let lenght = this.incorrectAddresses.length;
		if (this.incorrectAddresses.length <= 0) {
			//check if fix addresses should be removed from the list of steps
			if (this.checkIfStateInTheList(8)) {
				this.removeOneStepFromList(8);
			}
			this.incorrectAddressesToBeFixed = false;
			this.showPreviewStep();
		}
		else {
			this.incorrectAddressesToBeFixed = true;
			this.addressForm = new FormArray([]);
			var numberOfCorrectAddresses = null;
			numberOfCorrectAddresses = this.tempAddressService.GetNumberOfCorrectAddresses();
			numberOfCorrectAddresses.subscribe(
				numberOfCorrectAddresses => {
					this.numberOfCorrectAddresses = numberOfCorrectAddresses;
					this.addStepToListOfSteps(true, AddressesModalState.FIX_ADDRESSES, true);
					this.blockUI.stop();
				},
				error => { this.errorMessage = <any>error; return false; }
			);
		}
	}

	updateIncorrect() {
		this.blockUI.start();
		let response: any;
		this.correctAddress = this.addressForm.getRawValue().map(item => item as TempAddress);

		for (let i = 0; i < this.correctAddress.length; i++) {
			this.correctAddress[i].MailingGroupID = this._model.MailingGroupID
		}

		response = this.tempAddressService.updateAddresses(this.correctAddress);
		response.subscribe(
			response => {
				this.responseUpd = response;
				this.incorrectAddressesToBeFixed = false;
				this.incorrectAddresses = [];

				var numberOfCorrectAddresses = null;
				numberOfCorrectAddresses = this.tempAddressService.GetNumberOfCorrectAddresses();
				numberOfCorrectAddresses.subscribe(
					numberOfCorrectAddresses => {
						this.totalSelectedAddresses = numberOfCorrectAddresses;
						this.showPreviewStep();

					},
					error => { this.errorMessage = <any>error; return false; }
				);


			},
			error => this.errorMessage = <any>error
		);

	}



	showFillInStep() {
		let s = this.returnActiveStep();

		if (this.importerStep == false) {
			this.blockUI.stop();
			this.setPage(1);
			this.addStepToListOfSteps(true, AddressesModalState.FILL_IN_CUSTOM_FIELDS, false);
		}
		else //import case where user has forgotten to fill in custom fields
		{
			this.blockUI.stop();
			if (s.state != AddressesModalState.PREVIEW_ADDRESSES) {
				if (this.customHeadersForAddressGroups == undefined || this.customHeadersForAddressGroups.length < 1) {
					var customHeadersForAddressGroups = null;

					customHeadersForAddressGroups = this.tempAddressService.insertAdditionalCSVHeadersFromVariables();
					customHeadersForAddressGroups.subscribe(
						customHeadersForAddressGroups => {
							this.customHeadersForAddressGroups = customHeadersForAddressGroups;
							if (this.customHeadersForAddressGroups.length == 0) {
								this.showPreviewStep();
							}
							else {
								this.getTempAddressesForFillingCustomFields();
								this.setPage(1);
							}
						},
						error => this.errorMessage = <any>error
					);
				} else {
					this.getTempAddressesForFillingCustomFields();
				}
			}
		}
	}

	getTempAddressesForFillingCustomFields() {
		if (this.tempAddressesForAddressGroups == null || this.tempAddressesForAddressGroups.length == 0) {
			var tempAddresses = null;

			tempAddresses = this.tempAddressService.GetTempAddresses();
			tempAddresses.subscribe(
				tempAddresses => {
					while (this.customFieldsForm.controls.length != 0) {
						this.customFieldsForm.controls.splice(0, 1);
					}
					this.tempAddressesForAddressGroups = tempAddresses;
					this.totalSelectedAddresses = this.tempAddressesForAddressGroups.length;
					this.initCustomHeadersValues();

					this.setPage(1);
					this.addStepToListOfSteps(true, AddressesModalState.FILL_IN_CUSTOM_FIELDS, true);
					this.blockUI.stop();
				},
				error => this.errorMessage = <any>error
			);
		} else {
			this.setPage(1);
			this.addStepToListOfSteps(true, AddressesModalState.FILL_IN_CUSTOM_FIELDS, true);
			this.blockUI.stop();
		}
	}

	editMapping() {
		if (this._model.IsMapped == true) {
			this._model.IsMapped = false;
			this._model.SenderImported = false;
			this.incorrectAddressesToBeFixed = true;
			this.askForSender = false;
			var response = null;
			response = this.mailingService.updateMailing(this._model);
			response.subscribe(
				response => {
					if (response == "Update_success") {
						this._model.IsMapped = false;
						this.destinationCountrySelected = this.countriesMapping.find(x => x.CountryID == 0);
					}
					else {
						this._model.IsMapped = true;
					}
				}
			);
		}
	}

	//pager methods
	setPage(page: number) {
		if (page < 1 || !this.tempAddressesForAddressGroups) {
			return;
		}

		if (this.pager.currentPage != null && this.pager.totalPages != null && page > this.pager.totalPages) {
			return;
		}

		if (this.page != page) {
			this.customFieldsForm.controls = [];
			this.page = page;
		}

		let list: TempAddress[];

		list = this.tempAddressesForAddressGroups;

		this.totalTempAddressesForGroups = list.length;

		let totalPages = Math.ceil(list.length / this.pageSize);
		if (page > totalPages && list.length != 0) {
			return;
		}

		// get pager object from service
		this.pager = this.pagerService.getPager(list.length, page, this.pageSize);

		// get current page of items
		this.pagedItems = list.slice(this.pager.startIndex, this.pager.endIndex + 1);

	}


	addressModalNotFinished() {
		var status = null;
		status = this.preparationService.setInitializeStatus();
		status.subscribe(response => {
			if (response != null) {
				this._model.AdminStatusID = response.AdminStatusID;
				this.checkCustomFieldsInputLengths();
			}
		});
	}

	checkCustomFieldsInputLengths() {
		for (let i = 0; i < this.customHeadersForAddressGroups.length; i++) {
			for (let j = 0; j < this.customHeadersForAddressGroups[i].Values.length; j++) {

				if (this.customHeadersForAddressGroups[i].Values[j].Value.length > this.maxLenghtCustomField) {
					this.customHeadersValuesValid = false;
					return;
				}
			}
		}

		this.customHeadersValuesValid = true;
	}

	showPreviewStep() {
		this.blockUI.start();

		var response = null;
		var error: boolean = false;
		this.incorrectAddressesToBeFixed = false;
		if (this.importerStep == true) {
			this.variables = [];

			response = this.preparationService.updateDocumentVariables(this.variables);
			response.subscribe(
				tempAddress => {
					this.message = response;

					var mailingGroup = null;
					mailingGroup = this.preparationService.setAddressesImportedStatus();
					mailingGroup.subscribe(res => {
						if (res != null) {
							this._model.AdminStatusID = res.AdminStatusID;
							this.getAddressesPreview();
						}
					});

				},
				error => {
					this.errorMessage = <any>error;
					error = true;
					this.blockUI.stop();
				}
			);
		}
		else {
			var insertProgresProcess = null;

			insertProgresProcess = this.tempAddressService.InsertProgresProcess();
			insertProgresProcess.subscribe(
				insertProgresProcess => {
					if (this.customHeadersForAddressGroups && this.customHeadersForAddressGroups.length != 0) {
						this.blockUI.start();
						response = this.tempAddressService.insertValuesForAdditionalCSVHeadersFromVariables(this.customHeadersForAddressGroups);
						response.subscribe(
							tempAddress => {
								response;
								this.message = response;

								var mailingGroup = null;
								mailingGroup = this.preparationService.setAddressesImportedStatus();
								mailingGroup.subscribe(res => {
									if (res != null) {
										this._model.AdminStatusID = res.AdminStatusID;
										this.getAddressesPreview();
									}
								},
									error => {
										this.errorMessage = <any>error;
										this.blockUI.stop();
									});
							},
							error => {
								this.errorMessage = <any>error;
								error = true;
								this.blockUI.stop();
							}
						);
					}
					else {
						var mailingGroup = null;
						mailingGroup = this.preparationService.setAddressesImportedStatus();
						mailingGroup.subscribe(res => {
							if (res != null) {
								this._model.AdminStatusID = res.AdminStatusID;
								this.getAddressesPreview();
							}
						},
							error => {
								this.errorMessage = <any>error;
								this.blockUI.stop();
							});
					}
				},
				error => {
					this.errorMessage = <any>error;
					this.blockUI.stop();
				}
			);
		}


		var file = null;
		file = this.preparationService.getArrangedFile();
		file.subscribe(response => this.arrangedCsvFile = response);

	}

	getAddressesPreview() {
		var tempAddress = null;

		tempAddress = this.tempAddressService.getAddressPreview();
		tempAddress.subscribe(
			tempAddress => {
				this.previewAddress = tempAddress;
				if (this.importerStep == false) {
					this.addStepToListOfSteps(true, AddressesModalState.PREVIEW_ADDRESSES, false);
				}
				else {
					this.addStepToListOfSteps(true, AddressesModalState.PREVIEW_ADDRESSES, true);
				}

				if (this._model.SenderID != null && this._model.SenderID > 0) {
					var senderAddress = null;

					senderAddress = this.addressService.getSender();
					senderAddress.subscribe(
						address => {
							this.senderAddress = address;
							this.blockUI.stop();
						},
						error => {
							this.errorMessage = <any>error;
							this.blockUI.stop();
						}
					);
				}
				else {
					this.blockUI.stop();
				}

			},
			error => {
				this.errorMessage = <any>error;
				this.blockUI.stop();
			}
		);
	}

	markCompleted() {
		if (this.importerStep == false) {
			this.addStepToListOfSteps(true, AddressesModalState.COMPLETED, false);
		}
		else {
			this.addStepToListOfSteps(true, AddressesModalState.COMPLETED, true);
		}
		this.closeModal.nativeElement.click();
	}

	resetSteps() {
		this.steps = new Array<Step>();
		this.addStepToListOfSteps(true, AddressesModalState.NOT_INITIALIZED, false);
	}

	private select(index: number) {
		let tabArray: Array<Tab> = this.tabs.toArray();
		this.selectedTab = tabArray[index];
		this.tabsComponent.selectTab(this.selectedTab);
	}

	//checkIfFirstStep()
	//{
	//    if (this.steps.length == 1 && this.steps[0].state == 0)
	//    {
	//        this.addStepToListOfSteps(true, AddressesModalState.SELECT_LETTER_TYPE, false);
	//    }
	//}

	createAdditionalCSVHeadersFromVariables() {
		var customHeadersForAddressGroups = null;

		customHeadersForAddressGroups = this.tempAddressService.insertAdditionalCSVHeadersFromVariables();
		customHeadersForAddressGroups.subscribe(
			customHeadersForAddressGroups => {
				this.customHeadersForAddressGroups = customHeadersForAddressGroups;
			},
			error => this.errorMessage = <any>error
		);
    }

	initCustomHeadersValues() {
		for (let i = 0; i < this.customHeadersForAddressGroups.length; i++) {
			this.customHeadersForAddressGroups[i].Values = [];

			for (let j = 0; j < this.tempAddressesForAddressGroups.length; j++) {
				var val = new ValueCSVHeader;
				val.AddressID = this.tempAddressesForAddressGroups[j].AddressID;
				val.Value = "";
				val.AdditionalCSVHeaderID = this.customHeadersForAddressGroups[i].AdditionalCSVHeaderID;
				val.ValueCSVHeaderID = -1;

				this.customHeadersForAddressGroups[i].Values.push(val);
			}
		}
	}

	checkNumberOfAddresses(event) {
		if (JSON.stringify(this.addressGroupsMultiselectValues) !== JSON.stringify(event)) {

			var diffRemovedElements = _.difference(this.addressGroupsMultiselectValues, event);
			var diffAddedElements = _.difference(event, this.addressGroupsMultiselectValues);

			this.addressGroupsMultiselectValues = event;
			this.tempAddressesForAddressGroups = new Array<TempAddress>();
			var status = null;
			status = this.preparationService.setInitializeStatus();
			status.subscribe(response => {
				if (response != null) {
					this._model.AdminStatusID = response.AdminStatusID;
					if (this.customHeadersForAddressGroups != null) {
						for (let i = 0; i < this.customHeadersForAddressGroups.length; i++) {
							this.customHeadersForAddressGroups[i].Values = [];
						}
					}
				}
			});

		}
		if (this.addressGroupsMultiselectValues != null && this.addressGroupsMultiselectValues.length > 0) {
			//find number of unique selected addresses
			this.totalSelectedAddresses = _.uniq(this.addressGroupsMultiselectValues).length;
		}
		else {
			this.totalSelectedAddresses = 0;
		}
	}

	onSubmit(form: FormGroup) {
		if (this.showUpload == true) {
			//this.selectTab(2);
		}
		else {
			//this.selectTab(3);
		}
	}

	getTotalNumberOfPapers() {
		var totalNumberOfPapers = null;
		totalNumberOfPapers = this.mailingService.getTotalNumberOfPapers();

		totalNumberOfPapers.subscribe(
			totalNumberOfPapers => {
				this.totalNumberOfPapers = totalNumberOfPapers;

				if (this.checkIfEnveloppeShouldChange() == true) {
					var response = null;
					response = this.mailingService.updateMailing(this._model);

					response.subscribe(
						response => {

						},
						error => this.errorMessage = <any>error
					);
				}
			},
			error => this.errorMessage = <any>error
		);
	}

	checkIfEnveloppeShouldChange() {

		var newEnvelopeID;

		if (this.totalNumberOfPapers > 4) {

			if (this.totalNumberOfPapers > 9) {

				newEnvelopeID = this._model.PrintedEnvelope ? 7 : 2;

				this.dl.nativeElement.disabled = true;
				this.c5.nativeElement.disabled = true;
			}
			else {

				if (this._model.EnvelopID == 2 || this._model.EnvelopID == 7) {
					newEnvelopeID = this._model.PrintedEnvelope ? 7 : 2;

					this.dl.nativeElement.disabled = true;
					this.c5.nativeElement.disabled = false;
				}
				else {
					newEnvelopeID = this._model.PrintedEnvelope ? 6 : 1;

					this.dl.nativeElement.disabled = true;
					this.c5.nativeElement.disabled = false;
				}
			}
		}
		else {
			if (this._model.EnvelopID == 1 || this._model.EnvelopID == 6) {
				newEnvelopeID = this._model.PrintedEnvelope ? 6 : 1;

				this.dl.nativeElement.disabled = false;
				this.c5.nativeElement.disabled = false;
			}
			else if (this._model.EnvelopID == 2 || this._model.EnvelopID == 7) {
				newEnvelopeID = this._model.PrintedEnvelope ? 7 : 2;

				this.dl.nativeElement.disabled = false;
				this.c5.nativeElement.disabled = false;
			}
			else {
				newEnvelopeID = this._model.PrintedEnvelope ? 5 : 0;

				this.dl.nativeElement.disabled = false;
				this.c5.nativeElement.disabled = false;
			}
		}

		if (newEnvelopeID != this._model.EnvelopID) {
			this._model.EnvelopID = newEnvelopeID;
			return true;
		}
		else {
			return false;
		}
	}

	removeAddress(event) {
		this.incorrectAddresses = event;
	}

	ResetMailingGroup() {
		this.blockUI.start();
		//localStorage.removeItem("MailingGroupID");
		this._model.MainDocumentName = "";
		this._model.CSVDocumentName = "";
		this._model.AnnexList = Array<Document>();
		this._model.LetterTypeID = 0;
		this.addressesModalLocked = false;
		let message: any;
		message = this.removeTemplate();
		message.subscribe(
			res => {
				this.resetSteps();
				this.files = new Array<UploadFile>();
				this.filesAdr = Array<UploadFile>();
				this.modelIsCreated = false;
				this.addressesModalLocked = false;

				if (this.optionsPristine == true) {
					this.auth.isLoginSubject.subscribe(
						(value: boolean) => {
							if (value == true) {
								this.getPreferences();
							}
						}
					);
				}

				this.blockUI.stop();

			},
			error => { this.blockUI.stop(); }
		);

		let msg = null;

		msg = this.preparationService.removeAllAnnexes();
		msg.subscribe(
			res => {
				this.filesDoc = Array<UploadFile>();

			}
		)

		return message;
		//this.setStatusToInitialize();
	}

	removeAddresses(): Observable<any> {
		this.blockUI.start();
		let message: any;
		this.askToFillInCustomFields = false;
		this.askForSender = false;
		this.senderActivelyEmpty = false;
		this.incorrectAddressesToBeFixed = false;
		this._model.SenderID = -1;
		this.newSenderAddress = new Address();
		this._model.SenderPresent = false;
		this.numberOfInternationalDestinations = 0;
		this.senderChanged = false;
		this._model.CSVDocumentName = '';
		this.incorrectAddresses = new Array<TempAddress>();
		this.clearIncorrectFormArray();
		this.hideErrorMessageAdr = true;
		this.hideOkMessageAdr = true;
		this.filesAdr.pop();
		this.customHeaders = new Array<AdditionalCSVHeader>();
		this.customHeadersForAddressGroups = new Array<AdditionalCSVHeader>();
		this.mappers = new Array<HeaderMapper>();
		this.previewAddress = new Array<TempAddress>();
		this.totalSelectedAddresses = 0;
		this.addressGroups = new Array<AddressGroup>();
		this.addressGroupsMultiselectItems = new Array<TreeviewItem>();
		this.tempAddressesForAddressGroups = new Array<TempAddress>();
		this.removeAllStepsOverCurrentActive();
		this.modelIsCreated = false;
		this.addressesModalLocked = false;
		this.hrefUrl = null;
		this._model.IsMapped = false;
		this.hideAfterShowingAdresses = false;
		var response = null;
		response = this.mailingService.updateMailing(this._model);
		response.subscribe(res => {
			if (res = "Update_success") {
				this._model.IsMapped = false;
				this.destinationCountrySelected = this.countriesMapping.find(x => x.CountryID == 0);
			}
			else {
				this._model.IsMapped = true;
			}
			var status = null;
			status = this.preparationService.setInitializeStatus();
			status.subscribe(response => {
				if (response != null) {
					this._model.AdminStatusID = response.AdminStatusID;
				}
			});

		});

		let message2 = this.tempAddressService.deleteTempAddresses();

		message2.subscribe(
			message2 => {

				this.filesAdr = new Array<UploadFile>();
				this.blockUI.stop();
				this.closeModal.nativeElement.click();

			},
			error => { this.errorMessage = <any>error; this.blockUI.stop(); }

		);

		return message2;
	}

	removeTemplate() {
		let message: any;
		this.files.pop();
		this.variables = new Array<DocumentVariable>();
		var response = this.removeAddresses();
		this.modelIsCreated = false;
		response.subscribe(response => {
			this.resetSteps();
			message = this.preparationService.removeTemplate();

			message.subscribe(
				message => {
					this.message = message;
					this.getTotalNumberOfPapers();
					this._model.MainDocumentName = "";
					var status = null;
					status = this.preparationService.setInitializeStatus();
					status.subscribe(response => {
						if (response != null) {
							this._model.AdminStatusID = response.AdminStatusID;
						}
					});
				},
				error => this.errorMessage = <any>error
			);
		});

		this.files = new Array<UploadFile>();

		return response;
	}

	removeAnnex(doc: Document) {
		this.blockUI.start();
		let message: any;
		for (var i = 0; i < this._model.AnnexList.length; i++) {
			if (this._model.AnnexList[i].DocumentID == doc.DocumentID) {
				this._model.AnnexList.splice(i, 1);
				break;
			}
		}
		this.documentNum--;
		message = this.preparationService.removeDoc(doc.DocumentID);

		message.subscribe(
			message => {
				this.message = message;
				this.getTotalNumberOfPapers();
				this.blockUI.stop();
			},
			error => {
				this.errorMessage = <any>error;
				this.blockUI.stop();
			}
		);
		return message;
	}

	//deleteTempAddresses()
	//{
	//	let message = this.tempAddressService.deleteTempAddresses();

	//	message.subscribe(
	//		message => {

	//		},
	//		error => this.errorMessage = <any>error
	//	);

	//	return message;
	//}

	addCheckmark(id: any) {

		
	}

	promptForRestart(letterType: number) {
		if (this._model.LetterTypeID > 0 && this._model.MainDocumentName != '') {
			let dialogRef: MdDialogRef<ConfirmDialog>;
			dialogRef = this.dialogsService.confirm('En changeant le type de lettre, le processus est annulé.', 'Êtes-vous sûr de vouloir commencer depuis le début?');
			var ret;
			dialogRef.afterClosed().subscribe(result => {
				ret = result;

				if (ret == true) {
					this.ResetMailingGroup();
					this.updateModelLetterType(letterType)
				}                
			});
		}
		else {
			this.updateModelLetterType(letterType);
		}
	}

	updateModelLetterType(letterType: number) {
		
		this.blockUI.start();
		var response = null;
		var oldLetterType = this._model.LetterTypeID;
		this._model.LetterTypeID = letterType;

		response = this.mailingService.updateMailing(this._model);

		response.subscribe(
			response => {
				if (response == "Update_international_is_required" || (this.importerStep && (response == "Update_success" || response == "Update_addresses_is_required"))) {
					//if groups
					this.addressGroups = new Array<AddressGroup>();
					this.addressGroupsMultiselectItems = new Array<TreeviewItem>();

					if (this._model.CSVDocumentName != '') {

						this.askToFillInCustomFields = false;
						this.senderActivelyEmpty = false;
						this.incorrectAddressesToBeFixed = true;
						this._model.SenderID = -1;
						this.newSenderAddress = new Address();
						this._model.SenderPresent = false;

						this.senderChanged = true;
						this.hideOkMessageAdr = false;
						this.hideErrorMessageAdr = true;
						this.clearIncorrectFormArray();
						this.incorrectAddresses = new Array<TempAddress>();
						var status = null;
						status = this.preparationService.setInitializeStatus();
						status.subscribe(response => {
							if (response != null) {
								this._model.AdminStatusID = response.AdminStatusID;
							}
						});
						this.addressesModalLocked = false;
						this.customHeaders = new Array<AdditionalCSVHeader>();
						this.customHeadersForAddressGroups = new Array<AdditionalCSVHeader>();
						this.previewAddress = new Array<TempAddress>();
						this.totalSelectedAddresses = 0;
						this.addressGroups = new Array<AddressGroup>();
						this.addressGroupsMultiselectItems = new Array<TreeviewItem>();
						this.tempAddressesForAddressGroups = new Array<TempAddress>();
						this.removeAllStepsOverCurrentActive();
						var country = new Country();
						country.CountryID = 0;
						country.CountryName = "Etat à partir de l'adresse";
						this.IncorrectCountry = country;

					}
					else {
						//Update_addresses_is_required
						if (!((oldLetterType <= 2 && letterType <= 2) || (oldLetterType > 2 && letterType > 2))) {
							this.incorrectAddressesToBeFixed = true;
							var status = null;
							status = this.preparationService.setInitializeStatus();
							status.subscribe(response => {
								if (response != null) {
									this._model.AdminStatusID = response.AdminStatusID;
								}
							});
						}
					}
					if (oldLetterType != letterType) {
						this._model.IsMapped = false;
						this.destinationCountrySelected = this.countriesMapping.find(x => x.CountryID == 0);
					}
				}


				if (response == "Update_addresses_is_required" && !this.importerStep) {
					// this.selectTab(1);
					this.incorrectAddressesToBeFixed = true;
					var status = null;
					status = this.preparationService.setInitializeStatus();
					status.subscribe(response => {
						if (response != null) {
							this._model.AdminStatusID = response.AdminStatusID;
						}
					});
				}
				this.blockUI.stop();
				this.addStepToListOfSteps(true, AddressesModalState.SELECT_METHOD, false);
			},
			error => this.errorMessage = <any>error
		);
	}

	updateSender(senderID: number) {
		var response = null;
		this.blockUI.start();
		if (senderID == null) {
			this._model.SenderID = -1;
			this.newSenderAddress = new Address();
			response = this.mailingService.updateMailing(this._model);

			response.subscribe(
				response => {
					if (response == "Update_addresses_is_required") {
						this.senderChanged = true;
						var mailingGroup = null;
						mailingGroup = this.preparationService.setInitializeStatus();
						mailingGroup.subscribe(response => {
							this._model.AdminStatusID = response.AdminStatusID;
						});
					}
					this.blockUI.stop();
				},
				error => {
					this.errorMessage = <any>error;
					this.blockUI.stop();
				}
			);
		}
		else {
			this._model.SenderID = senderID;
			//the following is correct only in this method, when updating sender from sender input form (we know sender is not imported from file)
			this._model.SenderPresent = (senderID == -1) ? false : true;

			this.tempAddressesForAddressGroups = new Array<TempAddress>();
			if (this.importerStep == false) {
				//this.deleteTempAddresses();
				let message = this.tempAddressService.deleteTempAddresses();

				message.subscribe(
					message => {
						for (let i = 0; i < this.customHeadersForAddressGroups.length; i++) {
							this.customHeadersForAddressGroups[i].Values = [];
						}
						this.checkIfActivelyEmpty();
						response = this.mailingService.updateMailing(this._model);

						response.subscribe(
							response => {
								if (response == "Update_addresses_is_required") {
									this.senderChanged = true;
									var mailingGroup = null;
									mailingGroup = this.preparationService.setInitializeStatus();
									mailingGroup.subscribe(response => {
										this._model.AdminStatusID = response.AdminStatusID;
										this.blockUI.stop();
									});
								}
							},
							error => {
								this.errorMessage = <any>error;
								this.blockUI.stop();
							}
						);
					},
					error => this.errorMessage = <any>error
				);

			}
			else {
				this.checkIfActivelyEmpty();
				response = this.mailingService.updateMailing(this._model);

				response.subscribe(
					response => {
						if (response == "Update_addresses_is_required") {
							this.senderChanged = true;
							var mailingGroup = null;
							mailingGroup = this.preparationService.setInitializeStatus();
							mailingGroup.subscribe(response => {
								this._model.AdminStatusID = response.AdminStatusID;
							});
						}
						this.blockUI.stop();
					},
					error => {
						this.errorMessage = <any>error;
						this.blockUI.stop();
					}
				);

			}






		}


	}

	updateModel(envelopeType: boolean) {
		this.optionsPristine = false;
		if (this._model && this._model.MailingGroupID != null) {
			var response = null;

			if (envelopeType == true) {
				response = this.mailingService.updateMailing(this._model.toggleEnvelopeType());
			} else {
				response = this.mailingService.updateMailing(this._model);
			}
			response.subscribe(
				response => {
					if (response == "Over_Weight_Limit") {
						let dialogRef: MdDialogRef<ErrorDialog>;
						this.errorMessageAdr = "Nous recevons des lettres jusqu'à 500 grammes";
						dialogRef = this.dialogsService.error("Erreur de téléchargement", this.errorMessageAdr);
						var model = null;
						model = this.mailingService.getMailingGroup();
						model.subscribe(
							model => {
								if (model != null) {
									this._model.RectoVersoID = model.RectoVersoID;
									this._model.AccompRectoVersoID = model.AccompRectoVersoID;
									this._model.PorteAdress = model.PorteAdress;
									this._model.EnvelopID = model.EnvelopID;
									this._model.PrintedEnvelope = model.EnvelopID > 3 ? true : false;                                    
								}
							}
						);
					}
					else {
						if (response == "Update_addresses_is_required") {
							//this.selectTab(1);
							var status = null;
							status = this.preparationService.setInitializeStatus();
							status.subscribe(response => {
								if (response != null) {
									this._model.AdminStatusID = response.AdminStatusID;
								}
							});
						}
						this.getTotalNumberOfPapers();
					}
				},
				error => this.errorMessage = <any>error
			);
		}
		else {
			if (envelopeType == true) {
				response = this.mailingService.updateMailing(this._model.toggleEnvelopeType());
			}
		}
	}

	getLetterType(index: number) {
		if (this.letterTypes && this.letterTypes.length > 0) {
			let elem: LetterType = this.letterTypes.find(x => x.LetterTypeID == index);
			return elem.LetterTypeName;
		}
	}

	previsualiser(mailingGroupID) {

		if (this._model.AdminStatusID < 9) {
			return;
		}

		var publipostageResponse = this.mailingService.publipostage();

		publipostageResponse.subscribe(
			(publipostageResponse) => {
				if (publipostageResponse == "Started") {
					this.hiddenProgressBarPrev = false;
					var subscription = Observable.interval(1000).subscribe(x => {
						this.mailingService.progressStatus().subscribe((res) => {

							if (res.PercentComplete == null || res.PercentComplete == 100) {

							}
							else {
								this.progressActivePrev = true;
								this.progressPercentagePrev = res.PercentComplete;
							}
							if (res.PercentComplete == 100) {
								subscription.unsubscribe();
								this.progressPercentagePrev = 100;

								this.router.navigate(['/previsualiser']);
							}
						});
					});
				}
			},
			error => this.errorMessage = <any>error
		);

	}

	ngOnChanges() {
		//this._sharedService.publishData(this._model);
	}

	check(output: UploadOutput, uploaderType: string) {
		let oversizeFile: boolean;
		if (output.type === 'addedToQueue' && output.file.size > this.sizeLimit) {
			switch (uploaderType) {
				case 'template': this.uploadInputTmpl.emit({ type: 'cancel', id: output.file.id });
					this.stopPropagationTmpl = false;
					break;
				case 'address': this.uploadInputAdr.emit({ type: 'cancel', id: output.file.id });
					this.stopPropagationAdr = false;
					break;
				case 'document': this.uploadInputDoc.emit({ type: 'cancel', id: output.file.id });
					this.stopPropagationDoc = false;
					break;
			}
			let dialogRef: MdDialogRef<ErrorDialog>;
			dialogRef = this.dialogsService.error("Erreur de téléchargement", "Le fichier téléchargé a une taille plus grande que celle autorisée. La taille maximale du fichier allowd est de 64MB.");
			dialogRef.afterClosed().subscribe(() => {
			});
		}
		else {
			if (uploaderType == 'document') {
				if (output.type === 'addedToQueue') {
					this.currentFile = output.file;
				}
				if (this.stopPropagationDoc) {
					this.onUploadOutputDoc(output);
				}
				if (output.type === 'allAddedToQueue') {
					this.stopPropagationDoc = true;
				}
			}
			else {
				if (uploaderType != undefined && (uploaderType == 'template' ? this.stopPropagationTmpl : this.stopPropagationAdr) != false) {
					if (output.type === 'addedToQueue') {
						if ((uploaderType == 'template' ? this._model.MainDocumentName : this._model.CSVDocumentName) == "") {
							uploaderType == 'template' ? this.onUploadOutputTmpl(output) : this.onUploadOutputAdr(output);
						}
						else {
							let dialogRef: MdDialogRef<ConfirmDialog>;
							let filename = uploaderType == 'template' ? this._model.MainDocumentName : this._model.CSVDocumentName;
							dialogRef = this.dialogsService.confirm('Êtes-vous sûr de vouloir écraser le fichier?', filename);
							var ret;
							dialogRef.afterClosed().subscribe(result => {
								ret = result;

								if (ret == true) {
									var outputStart = output;
									outputStart.type = 'allAddedToQueue';
									if (uploaderType == 'template') {
										this.files = this.files.filter((file: UploadFile) => file === output.file);
										//this.removeDocument('template').subscribe(response => {
										//    this.files.push(output.file);
										//    this.stopPropagationTmpl = true;
										//    this.onUploadOutputTmpl(outputStart);
										//}
										// this.ResetMailingGroup();
										//  );

										this.removeTemplate();
										this.files.push(output.file);
										this.stopPropagationTmpl = true;
										this.onUploadOutputTmpl(outputStart);


									} else {
										this.filesAdr = this.filesAdr.filter((file: UploadFile) => file === output.file);
										this.removeAddresses().subscribe(response => {
											this.filesAdr.push(output.file);
											this.stopPropagationAdr = true;
											this.onUploadOutputAdr(outputStart);
										});
									}
								}
								else {
									this.uploadInputAdr.emit({ type: 'cancel', id: output.file.id });
									uploaderType == 'template' ? this.stopPropagationTmpl = true : this.stopPropagationAdr = true;
								}
							});
							uploaderType == 'template' ? this.stopPropagationTmpl = false : this.stopPropagationAdr = false;
						}
					}
					else {
						uploaderType == 'template' ? this.onUploadOutputTmpl(output) : this.onUploadOutputAdr(output);
					}
				}
				if (output.type === 'allAddedToQueue') {
					switch (uploaderType) {
						case 'template': this.stopPropagationTmpl = true;
							break;
						case 'address': this.stopPropagationAdr = true;
							break;
					}
				}
			}
		}
	}

	onUploadOutputTmpl(output: UploadOutput): void {

		if (this.isEdge == true) {
			this.blockUI.start();

		}
		// lets output to see what's going on in the console
		if (output.type === 'allAddedToQueue') { // when all files added in queue
			const event: UploadInput = {
				type: 'uploadAll',
				url: urlTmpl,
				method: 'POST',
				fieldName: 'uploadInputTmpl',
				data: {
					MailingGroupID: this._model.MailingGroupID,
					RectoVersoID: this._model.RectoVersoID.toString(),
					ColorID: this._model.ColorID.toString(),
					AccompRectoVersoID: this._model.AccompRectoVersoID.toString(),
					AccompColorID: this._model.AccompColorID.toString(),
					EnvelopID: this._model.EnvelopID.toString(),
					PrintedEnvelope: this._model.PrintedEnvelope ? 'true' : 'false',
					LetterTypeID: this._model.LetterTypeID.toString(),
					SenderNotPrinted: this._model.SenderNotPrinted ? 'true' : 'false',
					PorteAdress: this._model.PorteAdress == true ? 'true' : (this._model.PorteAdress == false ? 'false' : 'null'),
					ExtraStitched: this._model.ExtraStitched ? 'true' : 'false',
					BarCode: this._model.BarCode ? 'true' : 'false',
					SenderPresent: this._model.SenderPresent ? 'true' : 'false',
					AnnexLinked: 'false',
					MG: sessionStorage.getItem('MG')
				}
			};
			this.uploadInputTmpl.emit(event);

		} else if (output.type === 'addedToQueue') {
			this.files.push(output.file); // add file to array when added
			console.log("addedQueue");

		} else if (output.type === 'uploading') {
			console.log("uploading");
			// update current data in files array for uploading file
			if (this.isEdge == false) {
				this.blockUI.start();
			}
			const index = this.files.findIndex(file => file.id === output.file.id);
			this.files[index] = output.file;
		} else if (output.type === 'removed') {
			// remove file from array when removed
			this.files = this.files.filter((file: UploadFile) => file !== output.file);
		} else if (output.type === 'dragOver') { // drag over event
			this.dragOver = true;
		} else if (output.type === 'dragOut') { // drag out event
			this.dragOver = false;
		} else if (output.type === 'drop') { // on drop event
			this.dragOver = false;
		} else if (output.type === 'done') { // on drop event
			if (output.file.response["Message"] == "OK") {
				this._model.MailingGroupID = output.file.response["MailingGroupID"];
				if (sessionStorage.getItem("MG") != this._model.MailingGroupID.toString()) {
					sessionStorage.setItem("MG", this._model.MailingGroupID.toString());
				}
				//localStorage.setItem("MailingGroupID", this._model.MailingGroupID.toString());
				//this._sharedService.publishData(this._model.MailingGroupID);

				this.message = output.file.response["Message"];
				this.getTotalNumberOfPapers();
				this._model.MainDocumentName = output.file.name;
				this.customHeadersForAddressGroups = new Array<AdditionalCSVHeader>();
				if (this._model.MainDocumentName.split('.').pop().toLowerCase() == 'pdf' && this._model.PorteAdress == null) {
					this._model.PorteAdress = true;
					this.updateModel(false);
				}
			}
			else {
				let dialogRef: MdDialogRef<ErrorDialog>;
				this.errorMessageAdr = output.file.response["Message"];
				dialogRef = this.dialogsService.error("Erreur de téléchargement", this.errorMessageAdr);
				this.files = this.files.filter((file: UploadFile) => file !== output.file);
			}
			this.blockUI.stop();
			this.uploadTemplatebuttonElRef.nativeElement.value = '';
		}
	}

	onUploadOutputAdr(output: UploadOutput): void {
		// lets output to see what's going on in the console
		if (this.isEdge == true) {
			this.blockUI.start();

		}

		if (output.type === 'allAddedToQueue') { // when all files added in queue
			// uncomment this if you want to auto upload files when added
			const event: UploadInput = {
				type: 'uploadAll',
				url: urlAdr,
				method: 'POST',
				fieldName: 'uploadInputAdr',
				data: {
					MailingGroupID: this._model.MailingGroupID,
					RectoVersoID: this._model.RectoVersoID.toString(),
					ColorID: this._model.ColorID.toString(),
					AccompRectoVersoID: this._model.AccompRectoVersoID.toString(),
					AccompColorID: this._model.AccompColorID.toString(),
					EnvelopID: this._model.EnvelopID.toString(),
					PrintedEnvelope: this._model.PrintedEnvelope ? 'true' : 'false',
					LetterTypeID: this._model.LetterTypeID.toString(),
					SenderNotPrinted: this._model.SenderNotPrinted ? 'true' : 'false',
					PorteAdress: this._model.PorteAdress == true ? 'true' : (this._model.PorteAdress == false ? 'false' : 'null'),
					ExtraStitched: this._model.ExtraStitched ? 'true' : 'false',
					BarCode: this._model.BarCode ? 'true' : 'false',
					SenderPresent: this._model.SenderPresent ? 'true' : 'false',
					AnnexLinked: 'false',
					MG: sessionStorage.getItem('MG')
				}
			};

			this.uploadInputAdr.emit(event);
		} else if (output.type === 'addedToQueue') {

			this.filesAdr.push(output.file);
		} else if (output.type === 'uploading') {
			// update current data in files array for uploading file
			const index = this.filesAdr.findIndex(file => file.id === output.file.id);
			this.filesAdr[index] = output.file;
			if (this.isEdge == false) {
				this.blockUI.start();
			}
		} else if (output.type === 'removed') {
			// remove file from array when removed
			this.filesAdr = this.filesAdr.filter((file: UploadFile) => file !== output.file);
		} else if (output.type === 'dragOver') { // drag over event
			this.dragOverAdr = true;
		} else if (output.type === 'dragOut') { // drag out event
			this.dragOverAdr = false;
		} else if (output.type === 'drop') { // on drop event
			this.dragOverAdr = false;
		} else if (output.type === 'done') {
			if (output.file.response["Message"] == "OK") {
				this.message = output.file.response["Message"];
				this.askToFillInCustomFields = false;
				//this.askForSender = !output.file.response["SenderImported"];
				this.senderActivelyEmpty = false;
				this._model.SenderID = -1;
				this.newSenderAddress = new Address();
				//this._model.SenderPresent = output.file.response["SenderImported"];
				//this.numberOfInternationalDestinations = output.file.response["numberOfInternationalDestinations"];
				this.senderChanged = true;
				this._model.CSVDocumentName = output.file.name;
				this.hideOkMessageAdr = false;
				this.hideErrorMessageAdr = true;
				this.clearIncorrectFormArray();
				this.incorrectAddressesToBeFixed = true;
				var status = null;
				status = this.preparationService.setInitializeStatus();
				status.subscribe(response => {
					if (response != null) {
						this._model.AdminStatusID = response.AdminStatusID;
					}
				});

				this.allHeaders = output.file.response["Allheaders"];
			}
			else {
				this.hideErrorMessageAdr = false;
				this.hideOkMessageAdr = true;
				this.errorMessageAdr = output.file.response["Message"];
				this._model.CSVDocumentName = "";
			}
			this.uploadfilebuttonElRef.nativeElement.value = '';
			this.blockUI.stop();
		}
	}

	onUploadOutputDoc(output: UploadOutput): void {
		// lets output to see what's going on in the console
		if (this.isEdge == true) {
			this.blockUI.start();

		}
		if (output.type === 'allAddedToQueue') { // when all files added in queue
			// uncomment this if you want to auto upload files when added
			const event: UploadInput = {
				type: 'uploadAll',
				url: urlDoc,
				method: 'POST',
				fieldName: 'uploadInputDoc',
				data: {
					type: "anex",
					MailingGroupID: this._model.MailingGroupID,
					RectoVersoID: this._model.RectoVersoID.toString(),
					ColorID: this._model.ColorID.toString(),
					AccompRectoVersoID: this._model.AccompRectoVersoID.toString(),
					AccompColorID: this._model.AccompColorID.toString(),
					EnvelopID: this._model.EnvelopID.toString(),
					PrintedEnvelope: this._model.PrintedEnvelope ? 'true' : 'false',
					LetterTypeID: this._model.LetterTypeID.toString(),
					SenderNotPrinted: this._model.SenderNotPrinted ? 'true' : 'false',
					PorteAdress: this._model.PorteAdress == true ? 'true' : (this._model.PorteAdress == false ? 'false' : 'null'),
					ExtraStitched: this._model.ExtraStitched ? 'true' : 'false',
					BarCode: this._model.BarCode ? 'true' : 'false',
					SenderPresent: this._model.SenderPresent ? 'true' : 'false',
					AnnexLinked: 'false',
					MG: sessionStorage.getItem('MG')
				}
			};
			this.uploadInputDoc.emit(event);
		} else if (output.type === 'addedToQueue') {
			this.documentNum = this._model.AnnexList.length + 1;
			//if (this.filesDoc.length > 0) {
			this.filesDoc = this.filesDoc.filter((file: UploadFile) => file === output.file);
			//}
			this.filesDoc.push(output.file); // add file to array when added
		} else if (output.type === 'uploading') {
			// update current data in files array for uploading file
			const index = this.filesDoc.findIndex(file => file.id === output.file.id);
			this.filesDoc[index] = output.file;
			if (this.isEdge == false) {
				this.blockUI.start();
			}
		} else if (output.type === 'removed') {
			// remove file from array when removed
			this.filesDoc = this.filesDoc.filter((file: UploadFile) => file !== output.file);
		} else if (output.type === 'dragOver') { // drag over event
			this.dragOverDoc = true;
		} else if (output.type === 'dragOut') { // drag out event
			this.dragOverDoc = false;
		} else if (output.type === 'drop') { // on drop event
			this.dragOverDoc = false;
		} else if (output.type === 'done') { // on drop event
			if (output.file.response["Message"] == "OK") {
				this._model.MailingGroupID = output.file.response["MailingGroupID"];
				if (sessionStorage.getItem("MG") != this._model.MailingGroupID.toString()) {
					sessionStorage.setItem("MG", this._model.MailingGroupID.toString());
				}
				this.message = output.file.response["Message"];

				let doc = new Document();
				doc.FileName = output.file.name;
				doc.DocumentID = output.file.response["DocumentID"];
				this._model.AnnexList.push(doc);
				this.getTotalNumberOfPapers();
				this.addressesModalLocked = false;
			}
			else {
				let dialogRef: MdDialogRef<ErrorDialog>;
				this.errorMessageAdr = output.file.response["Message"];
				dialogRef = this.dialogsService.error("Erreur de téléchargement", this.errorMessageAdr);
				this.filesDoc = this.filesDoc.filter((file: UploadFile) => file !== output.file);
			}
			this.filesDoc = this.filesDoc.filter((file: UploadFile) => file === output.file);
			this.uploadTemplatebutton3ElRef.nativeElement.value = '';
			this.blockUI.stop();
		}
	}

	setCountryForAllIncorrect(country) {
		if (country.CountryID && country.CountryID > 0) {
			this.IncorrectCountry = this.countries.find(x => x.CountryID == country.CountryID)
		}

	}

	getAddressGroupsMultiselectItems(): TreeviewItem[] {

		var json = JSON.stringify(this.addressGroups);

		var items = new Array<TreeviewItem>();

		var internationalAllowed = (this._model.LetterTypeID == 1 || this._model.LetterTypeID == 3);

		this.addressGroups.forEach(group => {

			//get addresses from group
			var addresses = null;
			addresses = this.addressService.getAddressesFromGroup(group.AddressGroupID);
			addresses.subscribe(
				addresses => {
					const addressesActive = addresses.filter(adr => adr.Deleted == false);

					if (addressesActive != null && addressesActive.length > 0) {
						var item = new TreeviewItem({
							text: group.GroupName, value: -1, collapsed: true, checked: false
						});
						const childrenItems: TreeviewItem[] = [];
						addressesActive.forEach(address => {
							if (internationalAllowed || (address.CountryID != null && address.CountryID == 1)) {
								var childItem = new TreeviewItem({
									text: ((address.Firstname != null && address.Firstname != "") ? (address.Firstname + " ") : "") + ((address.Lastname != null && address.Lastname != "") ? (address.Lastname + " ") : "") + ((address.Company != null && address.Company != "") ? (address.Company + " ") : "") + ((address.Address1 != null && address.Address1 != "") ? (address.Address1 + " ") : "") + ((address.City != null && address.City != "") ? (address.City + " ") : ""), value: address.AddressID, checked: false
								});
								childrenItems.push(childItem);
							}
						});
						item.children = childrenItems;
						items.push(item);
					}
				},
				error => this.errorMessage = <any>error
			);
		});

		return items;
	}

	getAddressGroups() {
		var addressGroups = null;
		if (this._modelUser != null) {
			addressGroups = this.addressService.getAddressGroups(this._modelUser.Useremail);

			addressGroups.subscribe(
				addressGroups => {
					this.addressGroups = addressGroups;
					this.addressGroupsMultiselectItems = this.getAddressGroupsMultiselectItems();
				},
				error => this.errorMessage = <any>error
			);
		}
	}

	getSenderAddresses() {
		//this._modelUser = JSON.parse(localStorage.getItem('currentUser'));
		this.auth.getUser()
			.subscribe((response) => {
				this._modelUser = JSON.parse(response._body);
				var senderAddresses = null;
				if (this._modelUser != null && this._modelUser.Useremail != null && this._modelUser.Useremail != "") {
					senderAddresses = this.monCompteService.getSenderAddressesValid(this._modelUser.Useremail);
					senderAddresses.subscribe(
						senderAddresses => {
							this.senderAddresses = senderAddresses;
						},
						error => this.errorMessage = <any>error
					);

				}
			},
			error => this.errorMessage = <any>error
			);


	}



	getPreferences() {
		//this._modelUser = JSON.parse(localStorage.getItem('currentUser'));
		this.auth.getUser()
			.subscribe((response) => {
				this._modelUser = JSON.parse(response._body);

				var preferences = null;
				preferences = this.monCompteService.getPreferences();

				preferences.subscribe(
					preferences => {
						if (preferences != null) {
							this._model.ColorID = preferences.ColorID;
							this._model.RectoVersoID = preferences.RectoVersoID;
							this._model.AccompColorID = preferences.AccompColorID;
							this._model.AccompRectoVersoID = preferences.AccompRectoVersoID;
							this._model.EnvelopID = preferences.EnvelopeID;
							this._model.SenderNotPrinted = !preferences.PrintSenderOnEnvelope;
							this._model.PrintedEnvelope = preferences.EnvelopeID > 3 ? true : false;
							this._model.PorteAdress = preferences.PorteAdress;
							this._model.ExtraStitched = preferences.ExtraStitched;
							this._model.BarCode = preferences.BarCode;
							this._model.AnnexLinked = false;
						}
					},
					error => {
						this.errorMessage = <any>error;
					}
				);

			},
			error => this.errorMessage = <any>error
			);

	}

	clearLocaleStorage() {
		localStorage.clear();
		location.reload();
	}

	selectNewSender() {
		var senderAddresses = null;
		if (this._modelUser != null) {
			senderAddresses = this.monCompteService.getSenderAddressesValid(this._modelUser.Useremail);
			senderAddresses.subscribe(
				senderAddresses => {
					this.senderAddresses = senderAddresses;
					this.updateSender(this.senderAddresses[this.senderAddresses.length - 1].AddressID);
					this.blockUI.stop();
				},
				error => {
					this.errorMessage = <any>error;
					this.blockUI.stop();
				}
			);

		}
	}

	showDocumentOptionsDiv() {
		let arrowDoc = document.querySelector(".arrow-doc");
		let arrowAnnex = document.querySelector(".arrow-annex");
		if (this.showDocumentOptions == true) {
			this.showDocumentOptions = false;
			arrowDoc.classList.remove('rotate180');
		}
		else {
			arrowDoc.classList.add('rotate180');
			if (arrowAnnex != null) arrowAnnex.classList.remove('rotate180');
			this.showDocumentOptions = true;
			this.showAnnexOptions = false;
		}

	}

	showAnnexOptionsDiv() {
		let arrowDoc = document.querySelector(".arrow-doc");
		let arrowAnnex = document.querySelector(".arrow-annex");
		if (this.showAnnexOptions == true || this._model.AnnexLinked == true) {
			this.showAnnexOptions = false;
			arrowAnnex.classList.remove('rotate180');
		}
		else {
			if (arrowAnnex != null) arrowAnnex.classList.add('rotate180');
			arrowDoc.classList.remove('rotate180');
			this.showDocumentOptions = false;
			this.showAnnexOptions = true;
		}


	}

	linkAnnex() {
		this._model.AnnexLinked = !this._model.AnnexLinked;

		//this copies values from template to annex options, first time extra options are opened
		if (this._model.AnnexLinked == false) {
			this._model.AccompColorID = this._model.ColorID;
			this._model.AccompRectoVersoID = this._model.RectoVersoID;
		}

		this.updateModel(false);
		if (this._model.AnnexLinked == true) {
			this.showAnnexOptionsDiv();
		}

	}

	restartAddressesModal() {
		this.resetSteps();
		//this.checkIfFirstStep();
		this.removeAddresses();
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

	private getHeaderWithExamples(targetHeader: AdditionalCSVHeader): ValueCSVHeader[] {
		if (this.headersWithExamples != null) {
			let values: ValueCSVHeader[] = this.headersWithExamples.find(x => x.AdditionalCSVHeaderID == targetHeader.AdditionalCSVHeaderID).Values;

			return values;
		}
	}

}
