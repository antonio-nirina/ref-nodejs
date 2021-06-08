import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from "../Models/user";
import { Preference } from "../Models/preference";
import { Subscription } from "../Models/subscription";
import { PreparationService } from "../Services/preparation.service";
import { MonCompteService } from "../Services/moncompte.service";
import { Tab } from "../Tab/tab";
import { TabsSender } from "../Tab/tabsSender";
import { Address } from "../Models/address";
import { AuthenticationService } from '../Services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Country } from "../Models/country";
import { Civilite } from "../Models/civilite";
import { ZipCode } from "../Models/zipCode";
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DialogsService } from '../Services/dialogs.service';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ErrorDialog } from '../Components/error-dialog.component';
import { CapitalizePipe } from "../Pipes/capitalize.pipe";
import { NgForm } from '@angular/forms';
import { AdressPrincipaleComponent } from './adressPrincipale.component';

class Month 
{
    value: number;
    name: string;
}

@Component({
    selector: 'monCompte',
    templateUrl: './src/app/Views/Publipostage/monCompte.component.html',
    providers: [User]
})

export class MonCompteComponent {
    @ViewChild(TabsSender) tabsSenderComponent: TabsSender;
    @ViewChildren(Tab) tabs: QueryList<Tab>;
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('downloadFacture') downloadFacture: ElementRef;
    @ViewChild('fEmail') public emailForm: NgForm;
    @ViewChild('fPass') public passwordForm: NgForm;

    showContent: boolean;
    showContent1: boolean;
    showContent2: boolean;
    errorMessage: string;
    selectedTab: Tab;
    senderAddresses: Address[];
    selectedSenderAddress: Address;
    newSenderAddress: Address;
    initFinished: boolean;
    newAddressReloadTabs: boolean;
    countries: Country[];
    cities: ZipCode[];
    civilites: Civilite[];
    factureMonths: Month[];
    binaryString: any;
    hrefFactureUrl: any;
    hrefFactureName: string;
    showLoading: boolean;
    newEmail: string;
    oldPassword: string;
    newPassword: string;
    facturesYear: number;
    preferences: Preference;
    subscription: Subscription;
    hideOkMessagePassword: boolean;
    hideErrorMessagePassword: boolean;
    errorMessageEmail: string;
    hideOkMessageEmail: boolean;
    hideErrorMessageEmail: boolean;
	errorMessagePassword: string;
    showChangeMsgDoc: boolean;
    allYears: Array<string>;
    lastyear: string;
    subname: string;
    addressInsertForm: FormGroup;
    primaryAddress: Address;
    hideOkMessageAdr: boolean;


    constructor(private _model: User,
        private monCompteService: MonCompteService,
        private preparationService: PreparationService,
        private auth: AuthenticationService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private dialogsService: DialogsService
    ) {
        
        this.showLoading = false;
        this.showContent = false;
        this.showContent1 = false;
        this.showContent2 = false;
        this.newSenderAddress = new Address();
        this.initFinished = false;
        this.newAddressReloadTabs = false;
        this.factureMonths = [];
        this.newEmail = "";
        this.oldPassword = "";
        this.newPassword = "";
        this.facturesYear = 2018;
        this.preferences = new Preference();
        this.hideOkMessagePassword = true;
        this.hideErrorMessagePassword = true;
        this.errorMessagePassword = "";
        this.hideOkMessageEmail = true;
        this.hideErrorMessageEmail = true;
		this.errorMessageEmail = "";
        this.showChangeMsgDoc = false;
        this.hideOkMessageAdr = true;

        this.createForm();
    }

    ngOnInit() {


        //if (this.auth.loggedIn()) {
        //    this.auth.startupTokenRefresh();
        //}

        let civilites = null;
        civilites = this.preparationService.getAllCivilites();
        civilites.subscribe(res => {
            this.civilites = res;
        });

        var countries = null;

        countries = this.preparationService.getAllCountries();
        countries.subscribe(
            countries => {
                this.countries = countries;
            },
            error => this.errorMessage = <any>error
        );

        //this.getSenderAddresses();
        this.getPreferences();
        this.getSubscription();
       
        this.resetNewAddress();

        var now = new Date();
        this.getFactureMonths(now.getFullYear());
        this.auth.getUser()
            .subscribe((response) => {
                this._model = JSON.parse(response._body);

                let user = null;

                user = this.monCompteService.getPrimarySenderAddress(this._model.Useremail);
                user.subscribe(response => {
                    this.primaryAddress = response;


                    this.addressInsertForm = this.fb.group({
                        AddressID: new FormControl(this.primaryAddress.AddressID),
                        Civilite: new FormControl(this.primaryAddress.Civilite),
                        Firstname: new FormControl(this.primaryAddress.Firstname, Validators.maxLength(18)),
                        Lastname: new FormControl(this.primaryAddress.Lastname, Validators.maxLength(18)),
                        Email: new FormControl(this.primaryAddress.Email, [Validators.required, Validators.maxLength(38)]),
                        PhoneNumber: new FormControl(this.primaryAddress.PhoneNumber, [Validators.required, Validators.maxLength(38)]),
                        Company: new FormControl(this.primaryAddress.Company, Validators.maxLength(38)),
                        CompanyComplement: new FormControl(this.primaryAddress.CompanyComplement, Validators.maxLength(38)),
                        Address1: new FormControl(this.primaryAddress.Address1, [Validators.required, Validators.maxLength(38)]),
                        Address2: new FormControl(this.primaryAddress.Address2, Validators.maxLength(38)),
                        ZipPostalCode: new FormControl(this.primaryAddress.ZipPostalCode, Validators.maxLength(10)),
                        City: new FormControl(this.primaryAddress.City, Validators.maxLength(27)),
                        CountryID: new FormControl(this.primaryAddress.CountryID)
                    },
                        {
                            validator: this.customValidator.bind(this)
                        });

                })

            },
            error => this.errorMessage = <any>error
        );


    }

    
    //reloadTabsNewAddressAdded() {
    //    this.newAddressReloadTabs = true;
    //    this.getSenderAddresses();
    //    this.resetNewAddress();
    //    //this.ngOnInit();
    //}

    //getSenderAddresses() {
    //    var senderAddresses = null;
    //    this.auth.getUser()
    //        .subscribe((response) => {
    //        this._model = JSON.parse(response._body);
    //    senderAddresses = this.monCompteService.getSenderAddresses(this._model.Useremail);
    //    this.blockUI.start();
    //    senderAddresses.subscribe(
    //        senderAddresses => {
    //            this.senderAddresses = senderAddresses;

    //            let indexOfSelectedTab = this.tabs.toArray().indexOf(this.selectedTab);
    //            if (indexOfSelectedTab < 0 || indexOfSelectedTab >= this.senderAddresses.length) {
    //                indexOfSelectedTab = 0;
    //            }
    //            else if (this.newAddressReloadTabs == true) {
    //                indexOfSelectedTab = this.senderAddresses.length - 1;
    //                this.newAddressReloadTabs = false;
    //            }

    //            if (this.senderAddresses.length != 0)
    //            {
    //                setTimeout(() => {
    //                    if (this.initFinished == false)
    //                    {
    //                        this.initFinished = true;
    //                        this.select(0);
    //                    }
    //                    else
    //                    {
    //                        this.select(indexOfSelectedTab); 
    //                    }
    //                }, 10);
    //            }
    //            this.blockUI.stop();
    //        },
    //        error => {
    //            this.errorMessage = <any>error;
    //            this.blockUI.stop();
    //        }
    //    );   
    //        },
    //        error => this.errorMessage = <any>error);
    //}


    createForm() {
        this.addressInsertForm = this.fb.group({
            AddressID: '',
            Civilite: null,
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
            CountryID: 1
        });
    }


    getPreferences() {
        var preferences = null;
        preferences = this.monCompteService.getPreferences();

        preferences.subscribe(
            preferences => {
                if (preferences != null)
                {
                    this.preferences = preferences;
                } 
            },
            error => {
                this.errorMessage = <any>error;
            }
        );
    }


    getSubscription() {
        var subscription = null;
        subscription = this.monCompteService.getSubscription();

        subscription.subscribe(
            subscription => {
                if (subscription != null) {
                    this.subscription = subscription;
                    //@ts-ignore
                    var firstyear = new Date(this.subscription.SubscriptionDate).getFullYear();
                    var currentdate = new Date();
                    var lastyear = currentdate.getFullYear();
                    this.allYears = new Array<string>();
                    for (var i = firstyear; i <= lastyear; i++) {

                        this.allYears.push(i.toString());
                    }
                    this.lastyear = lastyear.toString();

                    var subtype = this.monCompteService.getSubscriptionType(this.subscription.SubscriptionSPTypeID.toString());
                    subtype.subscribe(
                        subtype => {
                            this.subname = subtype;
                        },
                        error => {
                            this.errorMessage = <any>error;
                        }
                    );

                }
            },
            error => {
                this.errorMessage = <any>error;
            }
        );
    }

    onCitySelected() {
        this.addressInsertForm.get('City').setValue(this.addressInsertForm.value.City);
    }

    updatePreferences() {

        var response = null;
		this.showChangeMsgDoc = true;
        response = this.monCompteService.updatePreferences(this.preferences);
		setTimeout(() => {
			this.showChangeMsgDoc = false;
		}, 3000);
        response.subscribe(
            response => {

            },
            error => {
                this.errorMessage = <any>error;
            }
        );
    }

    getFactureMonths(year: number)
    {
        var response = null;

        response = this.preparationService.getFactureMonths(year);

        response.subscribe(
            response => {
                this.factureMonths = response;
            },
            error => {
                this.errorMessage = <any>error;
            }
        );

    }

    getFacture(month: number, year: number) {
        //this.blockUI.start();
        this.showLoading = true;
        var binaryString = null;
        var date = new Date(year, month, 1, 0, 0, 0, 0);
        binaryString = this.preparationService.getMonthlyFacture(date);
        binaryString.subscribe(
            data => {
                if (data != null) {
                    this.binaryString = this._base64ToArrayBuffer(data.bytes);


                    var blob = new Blob([this.binaryString], {
                        type: "application/pdf"
                    });
                    this.hrefFactureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                    this.hrefFactureName = data.name + ".pdf";

                    setTimeout(() => {
                        this.downloadFacture.nativeElement.click();
                        //this.blockUI.stop();
                        this.showLoading = false;
                    }, 2000);


                }
                else {
                    let dialogRef: MdDialogRef<ErrorDialog>;
                    dialogRef = this.dialogsService.error("No factures for this month", "");
                    //this.blockUI.stop();
                    this.showLoading = false;
                }
            },
            error => {
                let dialogRef: MdDialogRef<ErrorDialog>;
                dialogRef = this.dialogsService.error("Some error", "");
                //this.blockUI.stop();
                this.showLoading = false;
            }
        );
    }

    setNewEmail()
    {
        if (this.newEmail == this._model.Useremail)
        {
            this.hideOkMessageEmail = true;
            this.hideErrorMessageEmail = false;
            this.hideOkMessagePassword = true;
            this.hideErrorMessagePassword = true;
            this.errorMessageEmail = "Email same as old one";
            this.emailForm.reset();
            this.newEmail = "";
            return;
        }
        
        var response = null;
        this.blockUI.start();
		response = this.monCompteService.updateUserEmail(this.newEmail);

        response.subscribe(
            response => {
                if (response._body == "false") {
                    this.hideOkMessageEmail = true;
                    this.hideErrorMessageEmail = false;
                    this.hideOkMessagePassword = true;
                    this.hideErrorMessagePassword = true;
                    this.errorMessageEmail = "Email registered with another user account";
                    this.emailForm.reset();
                    this.newEmail = "";
                }
                else if (response._body == "true") {
                    this._model.Useremail = this.newEmail;
                    this.emailForm.reset();
                    this.newEmail = "";
                    this.hideOkMessageEmail = false;
                    this.hideErrorMessageEmail = true;
                    this.hideOkMessagePassword = true;
                    this.hideErrorMessagePassword = true;
                    this.errorMessageEmail = "";
                }
                this.blockUI.stop();
            },
            error => {
                this.errorMessage = <any>error;
                this.blockUI.stop();
            }
        );
    }

    setNewPassword() {
        if (this.oldPassword == this.newPassword) {
            this.hideOkMessagePassword = true;
            this.hideErrorMessagePassword = false;
            this.hideOkMessageEmail = true;
            this.hideErrorMessageEmail = true;
            this.errorMessagePassword = "Password same as old one";
            this.passwordForm.reset();
            this.oldPassword = "";
            this.newPassword = "";
            return;
        }

        if (this.oldPassword == "" || this.newPassword == "") {
            this.hideOkMessagePassword = true;
            this.hideErrorMessagePassword = false;
            this.hideOkMessageEmail = true;
            this.hideErrorMessageEmail = true;
            this.errorMessagePassword = "Passwords must not be empty";
            this.passwordForm.reset();
            this.oldPassword = "";
            this.newPassword = "";
            return;
        }

        var response = null;
        this.blockUI.start();
		response = this.monCompteService.updateUserPassword(this.oldPassword, this.newPassword);

        response.subscribe(
            response => {
                if (response._body == "false")
                {
                    this.hideOkMessagePassword = true;
                    this.hideErrorMessagePassword = false;
                    this.hideOkMessageEmail = true;
                    this.hideErrorMessageEmail = true;
					this.errorMessagePassword = "Mauvais mot de passe, veuillez réessayer";
                    this.passwordForm.reset();
                    this.oldPassword = "";
                    this.newPassword = "";
                }
                else if (response._body == "true")
                {
                    this.hideOkMessagePassword = false;
                    this.hideErrorMessagePassword = true;
                    this.hideOkMessageEmail = true;
                    this.hideErrorMessageEmail = true;
                    this.errorMessagePassword = "";
                    this.passwordForm.reset();
                    this.newPassword = "";
                    this.oldPassword = "";
                }
                this.blockUI.stop();
            },
            error => {
                this.hideOkMessagePassword = true;
                this.hideErrorMessagePassword = false;
                this.hideOkMessageEmail = true;
                this.hideErrorMessageEmail = true;
                this.errorMessagePassword = "error changing password";
                this.passwordForm.reset();
                this.newPassword = "";
                this.oldPassword = "";
                this.errorMessage = <any>error;
                this.blockUI.stop();
            }
        );
    }

    resetNewAddress() {
        this.newSenderAddress.AddressID = null;
        this.newSenderAddress.Civilite = null;
        this.newSenderAddress.Lastname = null;
        this.newSenderAddress.Firstname = null;
        this.newSenderAddress.Company = null;
        this.newSenderAddress.Address1 = null;
        this.newSenderAddress.Address2 = null;
        this.newSenderAddress.ZipPostalCode = null;
        this.newSenderAddress.City = null;
        this.newSenderAddress.CountryID = null;
        this.newSenderAddress.IsPrimaryAddress = null;
    }

    selectedTabChanged(event) {
        if (this.tabs != null)
        {
            let tabArray: Array<Tab> = this.tabs.toArray();
            this.selectedTab = tabArray[event];
            this.selectedSenderAddress = this.senderAddresses[event];
        }
    }

    onSubmitMethod() {
        this.blockUI.start();
        if (this._model != null && this.addressInsertForm.valid == true) {

            let address: Address = new Address();
            address.Civilite = this.addressInsertForm.value.Civilite;
            address.AddressID = this.addressInsertForm.value.AddressID;
            address.Firstname = this.addressInsertForm.value.Firstname;
            address.Lastname = this.addressInsertForm.value.Lastname;
            address.Company = this.addressInsertForm.value.Company;
            address.Address1 = this.addressInsertForm.value.Address1;
            address.Address2 = this.addressInsertForm.value.Address2;
            address.ZipPostalCode = this.addressInsertForm.value.ZipPostalCode;
            address.City = this.addressInsertForm.value.City;
            address.CountryID = this.addressInsertForm.value.CountryID;
            address.Email = this.addressInsertForm.value.Email;
            address.PhoneNumber = this.addressInsertForm.value.PhoneNumber;
            address.CompanyComplement = this.addressInsertForm.value.CompanyComplement;
            address.IsPrimaryAddress = true;

            let updateAddress = null;
            updateAddress = this.monCompteService.updateSenderAddress(address);
            updateAddress.subscribe(res => {

                this.hideOkMessageAdr = false;
                this.blockUI.stop();
            });
        }
        else {
            //this.dialogUpdateOrCreateNewAddress();//and sends devis email
            //return;
            this.blockUI.stop();
        }
    }

    customValidator(group: FormGroup) {

        let noEmail: boolean = false;
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
            if (zipcodeString == null || zipcodeString.length != 5) {
                zipCodeLenght = true;
            }
        }
        else {
            if (zipcodeString.length > 10)
                zipMaxLength = true;
        }

        if (noSender || zipCodeLenght || noCountry || noEmail || noPhoneNumber || noAddress || firstNameMax || lastNameMax || companyMax || zipMaxLength || address1Max || address2Max || cityMaxLength || companyComplMax || emailMax || phoneMax) {
            return {
                noSender: noSender,
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


    citiesFromZip(zip) {
        var cities = null;

        var zipNumber = zip * 1;

        if (zipNumber == NaN || Number.isInteger(zipNumber) == false || zipNumber < 1000) {
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


    private select(index: number) {
        //let tabArray: Array<Tab> = this.tabs.toArray();
        //this.selectedTab = tabArray[index];
        //this.tabsSenderComponent.selectTab(this.selectedTab);
        //this.selectedSenderAddress = this.senderAddresses[index];
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
