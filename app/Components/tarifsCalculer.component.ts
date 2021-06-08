import { Component, trigger, state, style, transition, animate, keyframes, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PopoverModule } from 'ngx-popover';
import { User } from "../Models/user";
import { MailingGroup } from "../Models/mailingGroup";
import { MailingService } from '../Services/mailing.service';
import { UserService } from '../Services/user.service';
import { MonCompteService } from "../Services/moncompte.service";
import { PreparationService } from "../Services/preparation.service";
import { AlertService } from '../Services/alert.service';
import { AuthenticationService } from '../Services/index';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { Country } from "../Models/country";
import { TarifCalculer } from "../Models/tarifCalculer";
import { CountryPipe } from "../Pipes/country";
import { Address } from "../Models/address";
import { ZipCode } from "../Models/zipCode";
import { DialogsService } from '../Services/dialogs.service';
import { UpdateDialog } from '../Components/update-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SharedService } from '../Services/shared.service';
import * as _ from 'underscore';
//import { SimplePageScrollConfig } from 'ng2-simple-page-scroll';

@Component({
    selector: 'tarifscalculer',
    templateUrl: './src/app/Views/Publipostage/tarifsCalculer.component.html',
    providers: [User],
    animations: [

        trigger('focusPanel', [
            state('inactive', style({
                transform: 'scale(1)',
                height: '0'
            })),
            state('active', style({
                transform: 'scale(1.01)',
                height: 'auto'
            })),
            transition('inactive => active', animate('500ms ease')),
            transition('active => inactive', animate('500ms ease'))
        ])],
})

export class TarifsCalculerComponent {

    @ViewChild('dl') dl: ElementRef;
    @ViewChild('c5') c5: ElementRef;

    @BlockUI() blockUI: NgBlockUI;

    _model: TarifCalculer;
    _modelOld: TarifCalculer;
    mailingGroupID: string;
    curentState: number;
    isModelCreated: boolean;

    errorMessage: string;
    wrongPassword: boolean;
    countries: Country[];
    cities: ZipCode[];

    pricesLetterType: number[];
    binaryString: any;
    hrefUrl: any;
    hrefName: string;
    showLoadingBtn: boolean;
    addressInsertForm: FormGroup;
    primarySenderAddress: Address;
    oldSenderAddress: Address;
    addressChanged: boolean;
    emailAddressRegistered: boolean;
    newUser: boolean;
    newUserModel: any = {};
    dateToday: Date;
    dateInPostOffice: string;
    dateDelivered: string;
    endDate: string;

    myOptions: INgxMyDpOptions = {
        // other options...
        todayBtnTxt: "Aujourd'hui",
        dateFormat: 'dd.mm.yyyy',
        dayLabels: { su: 'Di', mo: 'Lu', tu: 'Ma', we: 'Me', th: 'Je', fr: 'Ve', sa: 'Sa' },
        monthLabels: { 1: 'Jan', 2: 'Fév', 3: 'Mar', 4: 'Avr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Aoû', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Déc' }
    };

    // Initialized to specific date (09.10.2018)
    //model: any = { date: { year: 2017, month: 10, day: 31 } }
    //model: any = { jsdate: new Date() };
    constructor(private preparationService: PreparationService,
        private mailingService: MailingService,
        private monCompteService: MonCompteService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        //private authService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService,
        private dialogsService: DialogsService,
        private auth: AuthenticationService,
        private _modelUser: User,
        private data: SharedService
    ) {
        this.isModelCreated = false;
        this.showLoadingBtn = true;
        this.addressChanged = true;
        this.curentState = 1;
        if (this.curentState = 1) {
            this.state = 'active'
        }
        this.createForm();

        //this.state = (this.state === 'inactive' ? 'active' : 'inactive');

        this.oldSenderAddress = new Address();
    }

    ngOnInit() {


        this._model = new TarifCalculer();
        this._modelOld = new TarifCalculer();
        this._model.MailingGroup = new MailingGroup();

        // this.mailingGroupID = localStorage.getItem("MailingGroupID");
        //this.isModelCreated = this.mailingGroupID == null ? false : true; 
        //same as in home

        this.preparationService.isModelCreated().subscribe(response => {
            this.isModelCreated = response;

            if (this.isModelCreated) {
                var model = null;
                var tempAddress = null;
                model = this.mailingService.getMailingGroup();
                model.subscribe(
                    model => {
                        if (model != null) {
                            this._model.MailingGroup = new MailingGroup();
                            this._model.MailingGroup.MailingGroupID = this.mailingGroupID;
                            this._model.MailingGroup.ColorID = model.ColorID;
                            this._model.MailingGroup.RectoVersoID = model.RectoVersoID;
                            this._model.MailingGroup.AnnexLinked = false;
                            this._model.MailingGroup.AccompColorID = model.AccompColorID;
                            this._model.MailingGroup.AccompRectoVersoID = model.AccompRectoVersoID;
                            this._model.MailingGroup.EnvelopID = model.EnvelopID;
                            this._model.MailingGroup.LetterTypeID = model.LetterTypeID;
                            this._model.MailingGroup.CSVDocumentName = model.CSVDocumentName != null ? model.CSVDocumentName : "";
                            this._model.MailingGroup.MainDocumentName = model.MainDocumentName != null ? model.MainDocumentName : "";
                            this._model.MailingGroup.SenderNotPrinted = model.SenderNotPrinted;
                            this._model.MailingGroup.PrintedEnvelope = this._model.MailingGroup.EnvelopID > 3 ? true : false;
                            this._model.MailingGroup.PorteAdress = model.PorteAdress;
                            this._model.MailingGroup.ExtraStitched = model.ExtraStitched;
                            this._model.MailingGroup.BarCode = model.BarCode;
                            this._model.MailingGroup.SenderID = model.SenderID;
                            this._model.MailingGroup.AdminStatusID = model.AdminStatusID;
                            this._model.MailingGroup.PriceEstimate = model.PriceEstimate;
                            this._model.MailingGroup.minNumberOfPapers = model.minNumberOfPapers;
                        }
                    });
            }
        });


        this.pricesLetterType = new Array(6).fill(0);
        this._model.NumberOfLetters = 1000;
        this._model.NumberOfPages = 1;
        this._model.DestinationCountryID = 1;
        this.emailAddressRegistered = false;
        this.newUser = true;
        this.dateToday = new Date();
        this.dateInPostOffice = "";
        this.dateDelivered = "";

        var countries = null;
        countries = this.preparationService.getAllCountries();
        countries.subscribe(
            countries => this.countries = countries,
            error => this.errorMessage = <any>error
        );

        this.addressInsertForm = this.fb.group({
            Title: new FormControl(null),
            Firstname: new FormControl(null, Validators.maxLength(18)),
            Lastname: new FormControl(null, Validators.maxLength(18)),
            Email: new FormControl(null, [Validators.required, Validators.maxLength(38)]),
            PhoneNumber: new FormControl(null, [Validators.required, Validators.maxLength(38)]),
            Company: new FormControl(null, Validators.maxLength(38)),
            CompanyComplement: new FormControl(null, Validators.maxLength(38)),
            Address1: new FormControl(null, [Validators.required, Validators.maxLength(38)]),
            Address2: new FormControl(null, Validators.maxLength(38)),
            ZipPostalCode: new FormControl(null, Validators.maxLength(10)),
            City: new FormControl(null, Validators.maxLength(27)),
            CountryID: new FormControl(1),
            Password: new FormControl(null)
        },
            {
                validator: this.customValidator.bind(this)
            });

        this.auth.loggedIn();


        this.auth.isLoginSubject.subscribe(
            (value: boolean) => {
               
                if (value == true) {
                    this.getPrimarySenderAddresses();
                }
            }
        );
    }

    savelink(link) {
        this.data.changeMessage(link);
    }

    createForm() {
        this.addressInsertForm = this.fb.group({
            Title: '',
            Lastname: '',
            Firstname: '',
            Email: '',
            PhoneNumber: '',
            Company: '',
            CompanyComplement: '',
            Address1: '',
            Address2: '',
            ZipPostalCode: '',
            City: '',
            Password: '',
            CountryID: 1
        });
    }

    ngOnChanges() {
        this.formReset();
    }

    formReset() {
        if (this.primarySenderAddress != null) {
            this.addressInsertForm.reset({
                Title: null,
                Firstname: this.primarySenderAddress.Firstname || null,
                Lastname: this.primarySenderAddress.Lastname || null,
                Email: this._modelUser.Useremail || this.primarySenderAddress.Email || null,
                PhoneNumber: this.primarySenderAddress.PhoneNumber || null,
                Company: this.primarySenderAddress.Company || null,
                CompanyComplement: this.primarySenderAddress.CompanyComplement || null,
                Address1: this.primarySenderAddress.Address1 || null,
                Address2: this.primarySenderAddress.Address2 || null,
                ZipPostalCode: this.primarySenderAddress.ZipPostalCode || null,
                City: this.primarySenderAddress.City || null,
                CountryID: this.primarySenderAddress.CountryID || 1,
                Password: null
            });
        }
        else {
            this.addressInsertForm.reset({
                Title: null,
                Firstname: null,
                Lastname: null,
                Email: null,
                PhoneNumber: null,
                Company: null,
                CompanyComplement: null,
                Address1: null,
                Address2: null,
                ZipPostalCode: null,
                City: null,
                CountryID: 1,
                Password: null
            });
        }
    }

    getPrimarySenderAddresses() {
        // this._modelUser = JSON.parse(localStorage.getItem('currentUser'));
        this.auth.getUser()
            .subscribe((response) => {
                this._modelUser = JSON.parse(response._body);

                if (this._modelUser != null) {
                    this.newUser = false;
                }
                
                var primarySenderAddress = null;

                if (this._modelUser != null && this._modelUser.Useremail != null && this._modelUser.Useremail != "") {

                    primarySenderAddress = this.monCompteService.getPrimarySenderAddress(this._modelUser.Useremail);
                    primarySenderAddress.subscribe(
                        primarySenderAddress => {
                            this.primarySenderAddress = primarySenderAddress;
                            if (this.primarySenderAddress != null) {
                                this.formReset();
                            }
                        },
                        error => this.errorMessage = <any>error
                    );
                }

            },
            error => {
            });
        
    }

    citiesFromZip(zip) {
        var cities = null;

        var zipNumber = zip * 1;

        if (zipNumber == NaN || Number.isInteger(zipNumber) == false || zipNumber < 1000)
        {
            return;
        }

        cities = this.preparationService.getCitiesFromZip(zip);
        cities.subscribe(
            cities => {
                this.cities = cities;
                if (cities != null) {
                    if (cities.length == 1) {
                        //populate city field automatically
                        this.addressInsertForm.get('City').setValue(cities[0].Libelle);
                    }
                    else if (cities.length > 1) {
                        //open dropdown
                    }
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    onZipChange(zipInput: string) {
      
        if (zipInput.length == 5) {
            this.citiesFromZip(zipInput);
        }
    }

    onCitySelected() {
        this.addressInsertForm.get('City').setValue(this.addressInsertForm.value.City);
    }

    onSubmitMethod() {
        //if user is not logged in initially, could be that it is a registered user, we try to log in to get the info
        //if existing user, he gets logged in, or gets an error message to correct the password
        //if new user, he will be registered with a new password
        this.blockUI.start();
        if (this._modelUser == null) {
            //let mailingID = localStorage.getItem("MailingGroupID");
            this.auth.login(this.addressInsertForm.value.Email, this.addressInsertForm.value.Password)
                .subscribe(result => {
                    this.newUser = false;
                    this.dialogUpdateOrCreateNewAddress();//and sends devis email
                    return;
                },
                error => {
                    if (error.status == 403)
                    {
                        this.alertService.error('Password is incorrect');
                        this.newUser = false;
                        this.wrongPassword = true;
                        this.blockUI.stop();
                        return;
                    }
                    else if (error.status == 401) //we have got a new user
                    {
                        this.newUserModel.FirstName = this.addressInsertForm.value.Firstname != null ? this.addressInsertForm.value.Firstname : "";
                        this.newUserModel.LastName = this.addressInsertForm.value.Lastname != null ? this.addressInsertForm.value.Lastname : "";
                        this.newUserModel.Useremail = this.addressInsertForm.value.Email;
                        this.newUserModel.Confemail = this.addressInsertForm.value.Email;
                        this.newUserModel.Userpassword = this.addressInsertForm.value.Password;
                        this.newUserModel.Confpassword = this.addressInsertForm.value.Password;
                        this.newUserModel.UserTypeID = '5';

                        var response = null;

                        response = this.userService.create(this.newUserModel);
                        response.subscribe(
                            response => {
                                if (response == "SUCCESS") {
                                    //insertPrimaryAddress from form values
                                    //mailingID = localStorage.getItem("MailingGroupID");
                                    this.auth.login(this.newUserModel.Useremail, this.newUserModel.Userpassword).subscribe(
                                        result => {
                                            //update minimal primary address with extra info
                                            var primarySenderAddress = null;
                                            primarySenderAddress = this.monCompteService.getPrimarySenderAddress(this.newUserModel.Useremail);
                                            primarySenderAddress.subscribe(
                                                primarySenderAddress => {
                                                    this.primarySenderAddress = primarySenderAddress;
                                                    this.updatePrimaryAddress();//and sends devis email
                                                },
                                                error => this.errorMessage = <any>error
                                            );
                                        },
                                        error => {
                                            this.errorMessage = error;
                                        });
                                }
                                else {
                                    this.errorMessage = response;
                                }
                            },
                            error => {
                                this.errorMessage = error;
                            });
                    }
                });
        }
        else
        {
            this.dialogUpdateOrCreateNewAddress();//and sends devis email
            return;
        }
    }

    backupCurrentForm()
    {
        this.oldSenderAddress.Firstname = this.addressInsertForm.value.Firstname;
        this.oldSenderAddress.Lastname = this.addressInsertForm.value.Lastname;
        this.oldSenderAddress.Company = this.addressInsertForm.value.Company;
        this.oldSenderAddress.Address1 = this.addressInsertForm.value.Address1;
        this.oldSenderAddress.Address2 = this.addressInsertForm.value.Address2;
        this.oldSenderAddress.ZipPostalCode = this.addressInsertForm.value.ZipPostalCode;
        this.oldSenderAddress.City = this.addressInsertForm.value.City;
        this.oldSenderAddress.CountryID = this.addressInsertForm.value.CountryID;
        this.oldSenderAddress.Email = this.addressInsertForm.value.Email;
        this.oldSenderAddress.PhoneNumber = this.addressInsertForm.value.PhoneNumber;
        this.oldSenderAddress.CompanyComplement = this.addressInsertForm.value.CompanyComplement;
    }

    isEqualToFormAddress(address: Address): boolean
    {
        return address.Firstname == this.addressInsertForm.value.Firstname &&
            address.Lastname == this.addressInsertForm.value.Lastname &&
            address.Company == this.addressInsertForm.value.Company &&
            address.Address1 == this.addressInsertForm.value.Address1 &&
            address.Address2 == this.addressInsertForm.value.Address2 &&
            address.ZipPostalCode == this.addressInsertForm.value.ZipPostalCode &&
            address.City == this.addressInsertForm.value.City &&
            address.CountryID == this.addressInsertForm.value.CountryID &&
            address.Email == this.addressInsertForm.value.Email &&
            address.PhoneNumber == this.addressInsertForm.value.PhoneNumber &&
            address.CompanyComplement == this.addressInsertForm.value.CompanyComplement;
    }

    dialogUpdateOrCreateNewAddress()
    {
        //check if primary address has any changes, if not, no need for dialog
        //also no need for dialog if address has not changed since last submit
        if (this.isEqualToFormAddress(this.oldSenderAddress))
        {
            document.getElementById("openModalButton").click();
            this.addressChanged = false;
            this.sendDevisEmail();
        }
        else
        {
            this.backupCurrentForm();
            this.blockUI.start();
            this.auth.getUser()
                .subscribe((response) => {
                    this._modelUser = JSON.parse(response._body);

                    if (this._modelUser != null) {
                        this.newUser = false;
                    }
                    var formClean = this.addressInsertForm.pristine;

                    var primarySenderAddress = null;

                    if (this._modelUser != null && this._modelUser.Useremail != null && this._modelUser.Useremail != "") {

                        primarySenderAddress = this.monCompteService.getPrimarySenderAddress(this._modelUser.Useremail);
                        primarySenderAddress.subscribe(
                            primarySenderAddress => {
                                this.primarySenderAddress = primarySenderAddress;
                                if (
                                    this.primarySenderAddress.Firstname == this.addressInsertForm.value.Firstname &&
                                    this.primarySenderAddress.Lastname == this.addressInsertForm.value.Lastname &&
                                    this.primarySenderAddress.Company == this.addressInsertForm.value.Company &&
                                    this.primarySenderAddress.Address1 == this.addressInsertForm.value.Address1 &&
                                    this.primarySenderAddress.Address2 == this.addressInsertForm.value.Address2 &&
                                    this.primarySenderAddress.ZipPostalCode == this.addressInsertForm.value.ZipPostalCode &&
                                    this.primarySenderAddress.City == this.addressInsertForm.value.City &&
                                    this.primarySenderAddress.CountryID == this.addressInsertForm.value.CountryID &&
                                    this.primarySenderAddress.Email == this.addressInsertForm.value.Email &&
                                    this.primarySenderAddress.PhoneNumber == this.addressInsertForm.value.PhoneNumber &&
                                    this.primarySenderAddress.CompanyComplement == this.addressInsertForm.value.CompanyComplement
                                ) {
                                    this._model.MailingGroup.SenderID = this.primarySenderAddress.AddressID;
                                    document.getElementById("openModalButton").click();
                                    this.addressChanged = false;
                                    this.sendDevisEmail();
                                    return;
                                }

                                this.addressChanged = true;
                                this.blockUI.stop();
                                let dialogRef: MdDialogRef<UpdateDialog>;

                                dialogRef = this.dialogsService.confirmUpdate('Souhaitez vous créer une nouvelle adresse ou mettre à jour une adresse précédente?', "");
                                var ret;
                                dialogRef.afterClosed().subscribe(result => {
                                    ret = result;
                                    this.blockUI.start();
                                    if (ret == true) {
                                        this.insertNewAddress();
                                    }
                                    else {
                                        this.updatePrimaryAddress();
                                    }
                                });
                            },
                            error => {
                                this.blockUI.stop();
                                this.errorMessage = <any>error;
                            }
                        );
                    }
                    else {
                        this.blockUI.stop();
                    }

                },
                error => {
                    this.blockUI.stop();
                    this.errorMessage = <any>error;
                }


            );
      
        }

    }

    insertNewAddress()
    {
        this.auth.getUser()
            .subscribe((response) => {
                this._modelUser = JSON.parse(response._body);

                const formModel = new Address();
                formModel.Firstname = this.addressInsertForm.value.Firstname;
                formModel.Lastname = this.addressInsertForm.value.Lastname;
                formModel.Company = this.addressInsertForm.value.Company;
                formModel.Address1 = this.addressInsertForm.value.Address1;
                formModel.Address2 = this.addressInsertForm.value.Address2;
                formModel.ZipPostalCode = this.addressInsertForm.value.ZipPostalCode;
                formModel.City = this.addressInsertForm.value.City;
                formModel.CountryID = this.addressInsertForm.value.CountryID;
                formModel.Email = this.addressInsertForm.value.Email;
                formModel.PhoneNumber = this.addressInsertForm.value.PhoneNumber;
                formModel.CompanyComplement = this.addressInsertForm.value.CompanyComplement;

                var response1 = null;
                response1 = this.monCompteService.insertSenderAddress(formModel, this._modelUser.Useremail);
                response1.subscribe(
                    response => {
                        this._model.MailingGroup.SenderID = response;
                        document.getElementById("openModalButton").click();
                        this.sendDevisEmail();
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this.blockUI.stop();
                    }
                );
            });
    }

    updatePrimaryAddress()
    {
      
        this.auth.getUser()
            .subscribe((response) => {
                this._modelUser = JSON.parse(response._body);

                //if (this._modelUser != null) {
                //    this.newUser = false;
                //}
                //var formClean = this.addressInsertForm.pristine;

                var primarySenderAddress = null;

                if (this._modelUser != null && this._modelUser.Useremail != null && this._modelUser.Useremail != "") {

                    primarySenderAddress = this.monCompteService.getPrimarySenderAddress(this._modelUser.Useremail);
                    primarySenderAddress.subscribe(
                        primarySenderAddress => {
                            this.primarySenderAddress.Firstname = this.addressInsertForm.value.Firstname;
                            this.primarySenderAddress.Lastname = this.addressInsertForm.value.Lastname;
                            this.primarySenderAddress.Company = this.addressInsertForm.value.Company;
                            this.primarySenderAddress.Address1 = this.addressInsertForm.value.Address1;
                            this.primarySenderAddress.Address2 = this.addressInsertForm.value.Address2;
                            this.primarySenderAddress.ZipPostalCode = this.addressInsertForm.value.ZipPostalCode;
                            this.primarySenderAddress.City = this.addressInsertForm.value.City;
                            this.primarySenderAddress.CountryID = this.addressInsertForm.value.CountryID;
                            this.primarySenderAddress.Email = this.addressInsertForm.value.Email;
                            this.primarySenderAddress.PhoneNumber = this.addressInsertForm.value.PhoneNumber;
                            this.primarySenderAddress.CompanyComplement = this.addressInsertForm.value.CompanyComplement;

                            var response = null;
                            response = this.monCompteService.updateSenderAddress(this.primarySenderAddress);
                            response.subscribe(
                                response => {
                                    this._model.MailingGroup.SenderID = this.primarySenderAddress.AddressID;
                                    document.getElementById("openModalButton").click();
                                    this.sendDevisEmail();
                                },
                                error => {
                                    this.errorMessage = <any>error;
                                    this.blockUI.stop();
                                }
                            );
                        });
                }
                else
                {
                    this.blockUI.stop();
                }
            });


    }

    sendDevisEmail() {

        if (JSON.stringify(this._model) != JSON.stringify(this._modelOld) || this.addressChanged == true)
        {
            this.blockUI.start();
            this._modelOld = _.clone(this._model);
            this._modelOld.MailingGroup = _.clone(this._model.MailingGroup);
            this.addressChanged = false;
            var response = null;
            response = this.preparationService.sendEmailDevis(this._model);
            response.subscribe(
                response => {
                    this.getCalculatorFacturePDF();
                },
                error => {
                    this.errorMessage = <any>error;
                    this.blockUI.stop();
                }
            );

        }
        else
        {
            this.blockUI.stop();
        }
    }

    updatePrintedEnveloppe() {
        this.mailingService.updateMailing(this._model.MailingGroup.toggleEnvelopeType());
        this.checkIfEnveloppeShouldChange();
    }

    onDateChanged(event: IMyDateModel): void {
        // date selected
    }

    state: string = 'inactive';

    toggleMove() {
        this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    }

    start() {
        this.curentState = 1;
    }

    next() {
        if (this.curentState == 4) {

            this.calculateRegularPrices();
            return;
        }
        else if (this.curentState == 5) {
            this._model.MailingGroup.PriceEstimate = this.pricesLetterType[this._model.MailingGroup.LetterTypeID - 1];
            this.getDates();
        }


        this.curentState++;
        //this.state = (this.state === 'inactive' ? 'active' : 'inactive');
        this.state = 'active';
    }

    getDates()
    {
        this.dateToday = new Date();

        var dateInPostOffice = null;

        dateInPostOffice = this.preparationService.getDateLaPosteOnlyPost(this._model);

        dateInPostOffice.subscribe(
            date => {
                this.dateInPostOffice = date.dateInPostOffice;
                this.dateDelivered = date.dateDelivered;
                this.endDate = date.endDate;
            },
            error => this.errorMessage = <any>error
        );
    }

    previous() {
        this.curentState--;
    }

    calculateRegularPrices() {
        this.pricesLetterType = new Array(6).fill(0);
        var prices = null;


        this.showLoadingBtn = false;

        prices = this.preparationService.getCalculatorPricesAllLetterTypes(this._model);
        prices.subscribe(
            prices => {
                for (var i = 0, len = this.pricesLetterType.length; i < len; i++) {
                    this.pricesLetterType[i] = prices[i] * this._model.NumberOfLetters;
                }
                this.showLoadingBtn = true;
                this.curentState++;
                //this.state = (this.state === 'inactive' ? 'active' : 'inactive');
                this.state = 'active';
            },
            error => this.errorMessage = <any>error
        );
    }

    getCalculatorFacturePDF() {
        this.blockUI.start();
        var binaryString = null;
        binaryString = this.preparationService.getCalculatorFacture(this._model)
        binaryString.subscribe(
            data => {
                this.binaryString = this._base64ToArrayBuffer(data.bytes);


                var blob = new Blob([this.binaryString], {
                    type: "application/pdf"
                });
                this.hrefUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

                this.hrefName = data.name + ".pdf";
                this.blockUI.stop();

            },
            error => {
                this.errorMessage = <any>error;
                this.blockUI.stop();
            }
        );
    }

    customValidator(group: FormGroup) {
        this.wrongPassword = false;

        let noEmail: boolean = false;
        let noPassword: boolean = false;
        let noSender: boolean = false;
        let noPhoneNumber: boolean = false;
        let noAddress: boolean = false;
        let firstNameMax: boolean = false;
        let lastNameMax: boolean = false;
        let companyMax: boolean = false;
        let companyComplMax: boolean = false;
        let emailMax: boolean = false;
        let phoneMax: boolean = false;
        let zipMaxLength: boolean = false;
        let cityMaxLength: boolean = false;
        let address1Max: boolean = false;
        let address2Max: boolean = false;

        let firstname: boolean = group.controls["Firstname"].value == "" || group.controls["Firstname"].value == null ? false : true;
        let lastname: boolean = group.controls["Lastname"].value == "" || group.controls["Lastname"].value == null ? false : true;
        let company: boolean = group.controls["Company"].value == "" || group.controls["Company"].value == null ? false : true;

        if (!(firstname || lastname || company)) {
            noSender = true;
        }

        if (firstname && group.controls["Firstname"].value.length > 18) {
            firstNameMax = true;
        }
        if (lastname && group.controls["Lastname"].value.length > 18) {
            lastNameMax = true;
        }
        if (company && group.controls["Company"].value.length > 38) {
            companyMax = true;
        }
        if (group.controls["CompanyComplement"].value != null && group.controls["CompanyComplement"].value.length > 38) {
            companyComplMax = true;
        }
        if (group.controls["Email"].value != null && group.controls["Email"].value.length > 38) {
            emailMax = true;
        }
        if (group.controls["PhoneNumber"].value != null && group.controls["PhoneNumber"].value.length > 38) {
            phoneMax = true;
        }


        let address1: boolean = (group.controls["Address1"].value == null ? false : true) && (group.controls["Address1"].value != "");
        let address2: boolean = (group.controls["Address2"].value == null ? false : true) && (group.controls["Address2"].value != "");
        let city: boolean = (group.controls["City"].value == null ? false : true) && (group.controls["City"].value != "");

        if (address1 && group.controls["Address1"].value.length > 38) {
            address1Max = true;
        }
        if (address2 && group.controls["Address2"].value.length > 38) {
            address2Max = true;
        }
        if (city && group.controls["City"].value.length > 27) {
            cityMaxLength = true;
        }


        noPassword = (group.controls["Password"].value == "" || group.controls["Password"].value == null) && this._modelUser == null;
        noEmail = (group.controls["Email"].value == "" || group.controls["Email"].value == null);
        noPhoneNumber = (group.controls["PhoneNumber"].value == "" || group.controls["PhoneNumber"].value == null);
        noAddress = (group.controls["Address1"].value == "" || group.controls["Address1"].value == null);

        let noCountry: boolean = false;
        noCountry = ((group.controls["CountryID"].value == null || group.controls["CountryID"].value == 0)) ? true : false;

        let zipCodeLenght: boolean = false;

        let zipcode = group.controls["ZipPostalCode"];

        const country = group.controls["CountryID"].value;
        let zipcodeString: string = zipcode.value;
        if (country && (country == 1)) {
            if (zipcodeString == null || zipcodeString.length != 5)
            {
                zipCodeLenght = true;
            }
        }
        else
        {
            if (zipcodeString.length > 10)
                zipMaxLength = true;
        }

        if (noSender || noPassword || zipCodeLenght || noCountry || noEmail || noPhoneNumber || noAddress || firstNameMax || lastNameMax || companyMax || zipMaxLength || address1Max || address2Max || cityMaxLength || companyComplMax || emailMax || phoneMax) {
            return {
                noSender: noSender,
                noPassword: noPassword,
                zipCodeLenght: zipCodeLenght,
                noEmail: noEmail,
                noPhoneNumber: noPhoneNumber,
                noAddress: noAddress,
                noCountry: noCountry,
                firstNameMax: firstNameMax,
                lastNameMax: lastNameMax,
                companyMax: companyMax,
                companyComplMax: companyComplMax,
                zipMaxLength: zipMaxLength,
                address1Max: address1Max,
                address2Max: address2Max,
                cityMaxLength: cityMaxLength,
                emailMax: emailMax,
                phoneMax: phoneMax
            }
        }
        else {
            return null;
        }

    }

    getNumberOfPapers()
    {
        var extraPortePage = (this._model.MailingGroup.PorteAdress == true && this._model.MailingGroup.EnvelopID < 3) ? 1 : 0;

        if (this._model.MailingGroup.RectoVersoID == 0) {
            return this._model.NumberOfPages + extraPortePage;
        }
        else {
            return this._model.NumberOfPages / 2 + this._model.NumberOfPages % 2;
        }
    }

    checkIfEnveloppeShouldChange() {

        var newEnvelopeID;
        var totalNumberOfPapers = this.getNumberOfPapers();

        if (totalNumberOfPapers > 4) {

            if (totalNumberOfPapers > 9) {

                newEnvelopeID = this._model.MailingGroup.PrintedEnvelope ? 7 : 2;

                this.dl.nativeElement.disabled = true;
                this.c5.nativeElement.disabled = true;
            }
            else {

                if (this._model.MailingGroup.EnvelopID == 2 || this._model.MailingGroup.EnvelopID == 7) {
                    newEnvelopeID = this._model.MailingGroup.PrintedEnvelope ? 7 : 2;

                    this.dl.nativeElement.disabled = true;
                    this.c5.nativeElement.disabled = false;
                }
                else {
                    newEnvelopeID = this._model.MailingGroup.PrintedEnvelope ? 6 : 1;

                    this.dl.nativeElement.disabled = true;
                    this.c5.nativeElement.disabled = false;
                }
            }
        }
        else {
            if (this._model.MailingGroup.EnvelopID == 1 || this._model.MailingGroup.EnvelopID == 6) {
                newEnvelopeID = this._model.MailingGroup.PrintedEnvelope ? 6 : 1;

                this.dl.nativeElement.disabled = false;
                this.c5.nativeElement.disabled = false;
            }
            else if (this._model.MailingGroup.EnvelopID == 2 || this._model.MailingGroup.EnvelopID == 7) {
                newEnvelopeID = this._model.MailingGroup.PrintedEnvelope ? 7 : 2;

                this.dl.nativeElement.disabled = false;
                this.c5.nativeElement.disabled = false;
            }
            else {
                newEnvelopeID = this._model.MailingGroup.PrintedEnvelope ? 5 : 0;

                this.dl.nativeElement.disabled = false;
                this.c5.nativeElement.disabled = false;
            }
        }

        if (newEnvelopeID != this._model.MailingGroup.EnvelopID) {
            this._model.MailingGroup.EnvelopID = newEnvelopeID;
            return true;
        }
        else {
            return false;
        }
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
}
