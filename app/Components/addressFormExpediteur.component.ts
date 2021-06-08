import { Component, Input, Output, OnChanges, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Country } from "../Models/country";
import { Address } from "../Models/address";
import { ZipCode } from "../Models/zipCode";
import { Civilite } from "../Models/civilite";
import { PreparationService } from "../Services/preparation.service";
import { AddressService } from "../Services/addresses.service";
import { User } from "../Models/user";
import { AddressGroup } from "../Models/addressGroup";
import { TreeviewConfig, TreeviewItem } from 'ng2-dropdown-treeview';
import { AuthenticationService } from '../Services/index';

@Component({
	selector: 'addressFormExpediteur',
	templateUrl: './src/app/Views/Publipostage/addressFormExpediteur.component.html'
})
export class AddressFormExpediteurComponent implements OnChanges {

    @ViewChild('closeExpediteurModal') closeExpediteurModal: ElementRef;
	@Input() adr: Address;
	@Input() user: User;
	@Output() public reloadParent: EventEmitter<any> = new EventEmitter<any>();
	addressForm: FormGroup;
    countries: Country[];
    civilites: Civilite[];
	cities: ZipCode[];
	errorMessage: string;
    testLog: string;
    serverError: boolean;
	

	constructor(
		private auth: AuthenticationService,
		private fb: FormBuilder,
		private preparationService: PreparationService,
		private addressesService: AddressService

	) {
		this.createForm();
		//this.onZipChange();
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
		var countries = null;
		countries = this.preparationService.getAllCountries();
		countries.subscribe(
			countries => this.countries = countries,
			error => this.errorMessage = <any>error
		);

		this.citiesFromZip(this.adr.ZipPostalCode);

        this.addressForm = this.fb.group({
            Civilite: new FormControl(this.adr.Civilite || null),
            Firstname: new FormControl(this.adr.Firstname || null, Validators.maxLength(18)),
            Lastname: new FormControl(this.adr.Lastname || null, Validators.maxLength(18)),
            Company: new FormControl(this.adr.Company || null, Validators.maxLength(38)),
            Address1: new FormControl(this.adr.Address1 || null, [Validators.required, Validators.maxLength(38)]),
            Address2: new FormControl(this.adr.Address2 || null, Validators.maxLength(38)),
            ZipPostalCode: new FormControl(this.adr.ZipPostalCode || null, Validators.maxLength(10)),
            City: new FormControl(this.adr.City || null, Validators.maxLength(27)),
			CountryID: new FormControl(this.adr.CountryID || null)
		},
			{
				validator: this.customValidator.bind(this)
			});
        

	}

	ngOnChanges() {
        this.addressForm.reset({
            Civilite: this.adr.Civilite || null,
			Lastname: this.adr.Lastname || null,
			Firstname: this.adr.Firstname || null,
			Company: this.adr.Company || null,
			Address1: this.adr.Address1 || null,
			Address2: this.adr.Address2 || null,
			ZipPostalCode: this.adr.ZipPostalCode || null,
			City: this.adr.City || null,
			CountryID: (this.adr.CountryID != null) ? this.adr.CountryID : null
		});
		
	}

	createForm() {
        this.addressForm = this.fb.group({
            Civilite: null,
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
						this.addressForm.get('City').setValue(cities[0].Libelle);
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
		this.addressForm.get('City').setValue(this.addressForm.value.City);
	}

	onSubmitMethod() {

		const formModel = this.adr;

        formModel.Civilite = this.addressForm.value.Civilite;
		formModel.Lastname = this.addressForm.value.Lastname;
		formModel.Firstname = this.addressForm.value.Firstname;
		formModel.Company = this.addressForm.value.Company;
		formModel.Address1 = this.addressForm.value.Address1;
		formModel.Address2 = this.addressForm.value.Address2;
		formModel.ZipPostalCode = this.addressForm.value.ZipPostalCode;
		formModel.City = this.addressForm.value.City;
		formModel.CountryID = this.addressForm.value.CountryID;

		if (this.adr.AddressID == null) {
			var response1 = null;
            response1 = this.addressesService.insertExpediteurAddress(formModel, this.user.Useremail);
			response1.subscribe(
				response => {

					if (response > 0)
					{
                        this.adr.AddressID = response;
                        this.addressForm.reset();
                        this.serverError = false;
                        if (this.closeExpediteurModal.nativeElement) {
                            this.closeExpediteurModal.nativeElement.click();
                        }
                    }
                    else {
                        this.serverError = true;
                    }

					//this.ngOnChanges();
					this.reloadParent.emit();
				},
				error => {
					this.errorMessage = <any>error;
				}
			);
		}
		else {
			var response2 = null;
			response2 = this.addressesService.updateDestinationAddress(formModel);
			response2.subscribe(
                response => {
                    if (this.closeExpediteurModal.nativeElement) {
                        this.closeExpediteurModal.nativeElement.click();
                    }
					//this.updateGroupsForAddress();
				},
				error => {
					this.errorMessage = <any>error;
				}
			);
		}

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