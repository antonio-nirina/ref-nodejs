import { Component, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Country } from "../Models/country";
import { Address } from "../Models/address";
import { ZipCode } from "../Models/zipCode";
import { Civilite } from "../Models/civilite";
import { PreparationService } from "../Services/preparation.service";
import { MonCompteService } from "../Services/moncompte.service";
import { AuthenticationService } from '../Services/index';
import { AddressService } from "../Services/addresses.service";
import { User } from "../Models/user";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
	selector: 'addressForm',
	templateUrl: './src/app/Views/Publipostage/addressForm.component.html'
})
export class AddressFormComponent implements OnChanges {
    @Input() adr: Address;
    @Input() user: User;
    @Input() countries: Country[];
	@Output() public reloadTabs: EventEmitter<any> = new EventEmitter<any>();

    @Output() senderID: EventEmitter<Address> = new EventEmitter<Address>();

    @Input('parentContoroller') parentContoroller: string;

    private selectedSenderAddress: Address;

    @Input() set selectedSenderAdr(value: Address) {

        this.selectedSenderAddress = value;
        if (this.selectedSenderAddress != null && this.selectedSenderAddress.AddressID == this.adr.AddressID && this.cities == null)
        {
            this.citiesFromZip(this.adr.ZipPostalCode);
        }
    }

    get selectedSenderAdr(): Address {

        return this.selectedSenderAddress;

    }

	@BlockUI() blockUI: NgBlockUI;

	addressInsertForm: FormGroup;
    cities: ZipCode[];
    civilites: Civilite[];
	errorMessage: string;
	testLog: string;
	message: string;
	isLoading = false;
	constructor(
		private auth: AuthenticationService,
		private fb: FormBuilder,
		private preparationService: PreparationService,
		private monCompteService: MonCompteService,
		private addressService: AddressService
	) {
		this.createForm();
	   // this.onZipChange();
	}

    ngOnInit() {
      
        let civilites = null;
        civilites = this.preparationService.getAllCivilites();
        civilites.subscribe(res => {
            this.civilites = res;
        });
        //if (this.auth.loggedIn()) {
        //    this.auth.startupTokenRefresh();
        //}

		//this.citiesFromZip(this.adr.ZipPostalCode);
		
        this.addressInsertForm = this.fb.group({
            Civilite: new FormControl((this.adr.Civilite != null) ? this.adr.Civilite : null),
            Firstname: new FormControl(this.adr.Firstname || null, Validators.maxLength(18)),
            Lastname: new FormControl(this.adr.Lastname || null, Validators.maxLength(18)),
            Company: new FormControl(this.adr.Company || null, Validators.maxLength(38)),
            Address1: new FormControl(this.adr.Address1 || null, [Validators.required, Validators.maxLength(38)]),
            Address2: new FormControl(this.adr.Address2 || null, Validators.maxLength(38)),
            ZipPostalCode: new FormControl(this.adr.ZipPostalCode || null, Validators.maxLength(10)),
            City: new FormControl(this.adr.City || null, Validators.maxLength(27)),
			CountryID: new FormControl(this.adr.CountryID || 0)
		},
			{
				validator: this.customValidator.bind(this)
			});

	}

	ngOnChanges() {
		this.addressInsertForm.reset({
			Civilite: (this.adr.Civilite != null) ? this.adr.Civilite : null,
			Lastname: this.adr.Lastname || null,
			Firstname: this.adr.Firstname || null,
			Company: this.adr.Company || null,
			Address1: this.adr.Address1 || null,
			Address2: this.adr.Address2 || null,
			ZipPostalCode: this.adr.ZipPostalCode || null,
			City: this.adr.City || null,
			CountryID: (this.adr.CountryID || 0)
		});
	}
	
	tabsReload() {
		this.reloadTabs.emit();
	}

	createForm() {
		this.addressInsertForm = this.fb.group({
			Civilite: 0,
			Lastname: '',
			Firstname: '',
			Company: '',
			Address1: '',
			Address2: '',
			ZipPostalCode: '',
			City: '',
			CountryID: 0
		});
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

    enableForm() {
        //this.senderID.emit(null);
		this.addressInsertForm.enable();
	}

	onZipChange(zipInput: string) {
		
		if (zipInput.length == 5) {
			this.citiesFromZip(zipInput);
		}
	}

	onCitySelected() {
		this.addressInsertForm.get('City').setValue(this.addressInsertForm.value.City);
	}

	addAddrerssToMailing() {
		let address: Address = new Address();

		address.Civilite = this.addressInsertForm.value.Civilite;
		address.Lastname = this.addressInsertForm.value.Lastname;
		address.Firstname = this.addressInsertForm.value.Firstname;
		address.Company = this.addressInsertForm.value.Company;
		address.Address1 = this.addressInsertForm.value.Address1;
		address.Address2 = this.addressInsertForm.value.Address2;
		address.ZipPostalCode = this.addressInsertForm.value.ZipPostalCode;
        address.City = this.addressInsertForm.value.City;
        address.CountryID = this.addressInsertForm.value.CountryID;

        if (this.adr.AddressID != null && this.adr.AddressID > -1)
        {
            address.AddressID = this.adr.AddressID;
            var response2 = null;
            response2 = this.addressService.updateAddressForMailingGroup(address);

            this.blockUI.start();
            response2.subscribe(
                response => {
                    this.senderID.emit(address);
                    this.adr = address;
                    this.addressInsertForm.disable();
                    this.blockUI.stop();
                },

                error => {
                    this.errorMessage = <any>error;
                    this.blockUI.stop();
                }

            );
        }
        else
        {
            var message = null;
            message = this.addressService.insertAddressForMailingGroup(address);
            this.blockUI.start();
            message.subscribe(
                response => {
                    if (response > 0) {
                        address.AddressID = response;
                        this.senderID.emit(address);
                        this.adr = address;
                        this.addressInsertForm.disable();
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

	onSubmitMethod() {
		this.isLoading = true;
		const formModel = this.adr;

		formModel.Civilite = this.addressInsertForm.value.Civilite;
		formModel.Lastname = this.addressInsertForm.value.Lastname;
		formModel.Firstname = this.addressInsertForm.value.Firstname;
		formModel.Company = this.addressInsertForm.value.Company;
		formModel.Address1 = this.addressInsertForm.value.Address1;
		formModel.Address2 = this.addressInsertForm.value.Address2;
		formModel.ZipPostalCode = this.addressInsertForm.value.ZipPostalCode;
		formModel.City = this.addressInsertForm.value.City;
		formModel.CountryID = this.addressInsertForm.value.CountryID;

		if (this.adr.AddressID == null) {
			var response1 = null;
			response1 = this.monCompteService.insertSenderAddress(formModel, this.user.Useremail);
			this.blockUI.start();
			response1.subscribe(
				response => {
					this.tabsReload();
					this.ngOnChanges();
					this.isLoading = false;
					//this.blockUI.stop();
				},
				error => {
					this.errorMessage = <any>error;
					this.blockUI.stop();
				}
			);
		}
		else {
			var response2 = null;
			response2 = this.monCompteService.updateSenderAddress(formModel);
			this.blockUI.start();
			response2.subscribe(
				response => {
					this.isLoading = false;
					this.blockUI.stop();
				},
				error => {
					this.errorMessage = <any>error;
					this.blockUI.stop();
				}
			);
		}


	}

	choisirPrincipal() {
		var response = null;

		if (this.adr.IsPrimaryAddress == true || this.adr.AddressID == null) {
			return;
		}

		response = this.monCompteService.choisirPrincipal(this.adr.AddressID, this.user.Useremail);
		this.blockUI.start();
		response.subscribe(
			response => {
				this.tabsReload();
				//this.blockUI.stop();
			},
			error => {
				this.errorMessage = <any>error;
				this.blockUI.stop();
			}
		);
	}

	deleteSenderAddress() {
		var response = null;

		if (this.adr.IsPrimaryAddress == true || this.adr.AddressID == null) {
			return;
		}

		response = this.monCompteService.deleteSenderAddress(this.adr.AddressID);
		this.blockUI.start();
		response.subscribe(
			response => {
				this.tabsReload();
				//this.blockUI.stop();
			},
			error => {
				this.errorMessage = <any>error;
				this.blockUI.stop();
			}
		);
	}

	customValidator(group: FormGroup) {
		let noDest: boolean = false;
		let noSender: boolean = false;

		let firstname: boolean = group.controls["Firstname"].value == "" || group.controls["Firstname"].value == null ? false : true;
		let lastname: boolean = group.controls["Lastname"].value == "" || group.controls["Lastname"].value == null ? false : true;
		let company: boolean = group.controls["Company"].value == "" || group.controls["Company"].value == null ? false : true;

		//let City: boolean = false;
		//City = ((group.controls["City"].value == "" || group.controls["City"].value == null)) ? false : true;

		if (!(firstname || lastname || company)) {
			noSender = true;
		}

		let noCountry: boolean = false;
		noCountry = ((group.controls["CountryID"].value == null || group.controls["CountryID"].value == 0)) ? true : false;
		
		let zipCodeLenght: boolean = false;

		let zipcode = group.controls["ZipPostalCode"];

		const country = group.controls["CountryID"].value;
		if (country && (country == 1)) {
			let zipcodeString: string = zipcode.value;
			if (zipcodeString == null || zipcodeString.length != 5)
				zipCodeLenght = true;
		}
		if (noSender || zipCodeLenght || noCountry /*|| City*/) {
			return {
				noSender: noSender,
				zipCodeLenght: zipCodeLenght,
				noCountry: noCountry,
				//City: City
			}
		}
		else {
			return null;
		}
	}


}