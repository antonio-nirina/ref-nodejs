import { Component, Input, Output, Inject, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TempAddressService } from "../Services/tempAddress.service";
import { TempAddress } from "../Models/tempAddress";
import { Country } from "../Models/country";

@Component({
    moduleId: module.id,
    selector: '[my-tbody]',
    templateUrl: '../Views/Publipostage/incorrectAddress.component.html'

})
export class IncorrectAddress {
    @Input('address') adr: TempAddress;
    @Input('list') addresses: TempAddress[];
    @Input('numberOfCorrectAddresses') numberOfCorrectAddresses: number;
    @Input('countries') countries: Country[];
    @Input('adrFr') addressForm: FormArray;
    @Input('index') index: number;
    @Input('letterType') letterType: number;
    @Input('showSender') showSender: boolean;
    @Input('newCountry') newCountry: Country;

    @Output('adrFr') test = new EventEmitter();

    errorMessage: string;

    set adrFr(val) {
        this.addressForm = val;
        this.test.emit(this.addressForm)
    }
    //@Output() change: EventEmitter<TempAddress[]> = new EventEmitter<TempAddress[]>();

    //addressForm: FormGroup;
    address: TempAddress;

    constructor(private _fb: FormBuilder,
        private tempAddressService: TempAddressService ) { }

    ngOnInit() {
        const farray = this.addressForm;
        var ad = this.initAddress(this.adr);
        farray.push(ad);

        if (!(this.letterType == 1 || this.letterType == 3)) {
            this.countries = this.countries.filter((country: Country) => country.CountryID == 1)
        }

        //let country: Country = new Country();
        //country.CountryID = 0;
        //country.CountryName = "<Choisissez un pays>"

        //this.countries.unshift(country); //push(country);

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.newCountry)
            this.setCountry();
    }

    setCountry() {
        if (this.newCountry.CountryID > 0) {
            const farray = this.addressForm;
            farray.controls[this.index].patchValue({
                CountryDestID: this.newCountry.CountryID
            });
        }                
    }

    
    initAddress(adr: TempAddress) {
        if (this.showSender == true)
        {
            return this._fb.group({
                AddressID: new FormControl(adr.AddressID),
                FirstNameDest: new FormControl(adr.FirstNameDest, Validators.maxLength(18)),
                LastNameDest: new FormControl(adr.LastNameDest, Validators.maxLength(18)),
                CompanyDest: new FormControl(adr.CompanyDest, Validators.maxLength(38)),
                AddressDest1: new FormControl(adr.AddressDest1, [Validators.required, Validators.maxLength(38)]),
                AddressDest2: new FormControl(adr.AddressDest2, Validators.maxLength(38)),
                ZipPostalCodeDest: new FormControl(adr.ZipPostalCodeDest, Validators.maxLength(10)),
                CityDest: new FormControl(adr.CityDest, [Validators.required, Validators.maxLength(27)]),
                CountryDestID: new FormControl(adr.CountryDestID),
                FirstNameSender: new FormControl(adr.FirstNameSender, Validators.maxLength(18)),
                LastNameSender: new FormControl(adr.LastNameSender, Validators.maxLength(18)),
                CompanySender: new FormControl(adr.CompanySender, Validators.maxLength(38)),
                AddressSender1: new FormControl(adr.AddressSender1, [Validators.required, Validators.maxLength(38)]),
                AddressSender2: new FormControl(adr.AddressSender2, Validators.maxLength(38)),
                ZipPostalCodeSender: new FormControl(adr.ZipPostalCodeSender, Validators.maxLength(10)),
                CitySender: new FormControl(adr.CitySender, [Validators.required, Validators.maxLength(27)]),
                CountrySenderID: new FormControl(adr.CountrySenderID)

            },
            {
                validator: this.customValidator.bind(this)
            });
        }
        else
        {
            return this._fb.group({
                AddressID: new FormControl(adr.AddressID),
                FirstNameDest: new FormControl(adr.FirstNameDest, Validators.maxLength(18)),
                LastNameDest: new FormControl(adr.LastNameDest, Validators.maxLength(18)),
                CompanyDest: new FormControl(adr.CompanyDest, Validators.maxLength(38)),
                AddressDest1: new FormControl(adr.AddressDest1, [Validators.required, Validators.maxLength(38)]),
                AddressDest2: new FormControl(adr.AddressDest2, Validators.maxLength(38)),
                ZipPostalCodeDest: new FormControl(adr.ZipPostalCodeDest, Validators.maxLength(10)),
                CityDest: new FormControl(adr.CityDest, [Validators.required, Validators.maxLength(27)]),
                CountryDestID: new FormControl(adr.CountryDestID),
                FirstNameSender: new FormControl(adr.FirstNameSender, Validators.maxLength(18)),
                LastNameSender: new FormControl(adr.LastNameSender, Validators.maxLength(18)),
                CompanySender: new FormControl(adr.CompanySender, Validators.maxLength(38)),
                AddressSender1: new FormControl(adr.AddressSender1, Validators.maxLength(38)),
                AddressSender2: new FormControl(adr.AddressSender2, Validators.maxLength(38)),
                ZipPostalCodeSender: new FormControl(adr.ZipPostalCodeSender, Validators.maxLength(10)),
                CitySender: new FormControl(adr.CitySender, Validators.maxLength(27)),
                CountrySenderID: new FormControl(adr.CountrySenderID)

            },
                {
                    validator: this.customValidator.bind(this)
                });
        }
    }

    delete(adr: TempAddress) {
        if (this.numberOfCorrectAddresses == 0 && this.addresses.length == 1)
        {
            return;
        }

        //let mailingGroupID: string = localStorage.getItem("MailingGroupID");

        var message = null;
        message = this.tempAddressService.deleteTempAddress(adr.AddressID);
        message.subscribe(
            message => {
            },
            error => this.errorMessage = <any>error
        );

        var index = this.addresses.indexOf(this.adr);
        this.addresses.splice(index, 1);
        //this.change.emit(this.addresses);

        const farray = this.addressForm;
        farray.removeAt(this.index);
    }

    customValidator(group: FormGroup) {
        let noDest: boolean = false;
        let noSender: boolean = false;
        let firstNameSenderMax: boolean = false;
        let lastNameSenderMax: boolean = false;
        let companySenderMax: boolean = false;
        let firstNameDestMax: boolean = false;
        let lastNameDestMax: boolean = false;
        let companyDestMax: boolean = false;
        let zipSenderMaxLength: boolean = false;
        let zipDestMaxLength: boolean = false;
        let citySenderMaxLength: boolean = false;
        let cityDestMaxLength: boolean = false;
        let address1SenderMax: boolean = false;
        let address1DestMax: boolean = false;
        let address2SenderMax: boolean = false;
        let address2DestMax: boolean = false;

        if (this.showSender == true)
        {
            //in fact it should state:
            //let firstname: boolean = (group.controls["FirstNameSender"].value == null ? false : true) && (group.controls["FirstNameSender"].value != "")
            //but this somehow works
            let firstname: boolean = group.controls["FirstNameSender"].value == "" || group.controls["FirstNameSender"].value == null ? false : true;
            let lastname: boolean = group.controls["LastNameSender"].value == "" || group.controls["LastNameSender"].value == null ? false : true;
            let company: boolean = group.controls["CompanySender"].value == "" || group.controls["CompanySender"].value == null ? false : true;

            if (!(firstname || lastname || company)) {
                noSender = true;
            }

            if (firstname && group.controls["FirstNameSender"].value.length > 18)
            {
                firstNameSenderMax = true;
            }
            if (lastname && group.controls["LastNameSender"].value.length > 18)
            {
                lastNameSenderMax = true;
            }
            if (company && group.controls["CompanySender"].value.length > 38)
            {
                companySenderMax = true;
            }
            let address1: boolean = (group.controls["AddressSender1"].value == null ? false : true) && (group.controls["AddressSender1"].value != "");
            let address2: boolean = (group.controls["AddressSender2"].value == null ? false : true) && (group.controls["AddressSender2"].value != "");
            let city: boolean = (group.controls["CitySender"].value == null ? false : true) && (group.controls["CitySender"].value != "");

            if (address1 && group.controls["AddressSender1"].value.length > 38) {
                address1SenderMax = true;
            }
            if (address2 && group.controls["AddressSender2"].value.length > 38) {
                address2SenderMax = true;
            }
            if (city && group.controls["CitySender"].value.length > 27) {
                citySenderMaxLength = true;
            }
        }

        let firstnameD: boolean = group.controls["FirstNameDest"].value == "" || group.controls["FirstNameDest"].value == null ? false : true;
        let lastnameD: boolean = group.controls["LastNameDest"].value == "" || group.controls["LastNameDest"].value == null ? false : true;
        let companyD: boolean = group.controls["CompanyDest"].value == "" || group.controls["CompanyDest"].value == null ? false : true;

        if (!(firstnameD || lastnameD || companyD)) {
            noDest = true;
        }

        if (firstnameD && group.controls["FirstNameDest"].value.length > 18)
        {
            firstNameDestMax = true;
        }
        if (lastnameD && group.controls["LastNameDest"].value.length > 18)
        {
            lastNameDestMax = true;
        }
        if (companyD && group.controls["CompanyDest"].value.length > 38)
        {
            companyDestMax = true;
        }

        let address1Dest: boolean = (group.controls["AddressDest1"].value == null ? false : true) && (group.controls["AddressDest1"].value != "");
        let address2Dest: boolean = (group.controls["AddressDest2"].value == null ? false : true) && (group.controls["AddressDest2"].value != "");
        let cityDest: boolean = (group.controls["CityDest"].value == null ? false : true) && (group.controls["CityDest"].value != "");

        if (address1Dest && group.controls["AddressDest1"].value.length > 38) {
            address1DestMax = true;
        }
        if (address2Dest && group.controls["AddressDest2"].value.length > 38) {
            address2DestMax = true;
        }
        if (cityDest && group.controls["CityDest"].value.length > 27) {
            cityDestMaxLength = true;
        }

        let noCountrySender: boolean = false;

        if (this.showSender == true)
        {
            noCountrySender = ((group.controls["CountrySenderID"].value == null || group.controls["CountrySenderID"].value == 0)) ? true : false;
        } 

        let noCountryDest: boolean = false;
        noCountryDest = (group.controls["CountryDestID"].value == null || group.controls["CountryDestID"].value == 0) ? true : false;

        let zipCodeLenght: boolean = false;
        let zipCodeLenghtD: boolean = false;

        if (this.showSender == true)
        {
            let zipcode = group.controls["ZipPostalCodeSender"];
            let zipcodeString: string = zipcode.value;

            const country = group.controls["CountrySenderID"].value;
            if (country && (country == 1)) {
                if (zipcodeString.length != 5)
                    zipCodeLenght = true;
            }
            else {
                if (zipcodeString.length > 10)
                    zipSenderMaxLength = true;
            }
        }
        let zipcodeD = group.controls["ZipPostalCodeDest"];
        //if (!zipcode || !zipcode.value) return;

        const countryD = group.controls["CountryDestID"].value;
        let zipcodeStringD: string = zipcodeD.value;
        if (countryD && (countryD == 1)) {
            if (zipcodeStringD.length != 5)
                zipCodeLenghtD = true;
        }
        else {
            if (zipcodeStringD.length > 10)
                zipDestMaxLength = true;
        }

        if (noSender || noDest || zipCodeLenght || zipCodeLenghtD || noCountrySender || noCountryDest || firstNameSenderMax || lastNameSenderMax || companySenderMax || firstNameDestMax || lastNameDestMax || companyDestMax || zipSenderMaxLength || zipDestMaxLength || address1SenderMax || address2SenderMax || address1DestMax || address2DestMax || citySenderMaxLength || cityDestMaxLength) {
            return {
                noSender: noSender,
                noDest: noDest,
                zipCodeLenght: zipCodeLenght,
                zipCodeLenghtD: zipCodeLenghtD,
                noCountrySender: noCountrySender,
                noCountryDest: noCountryDest,
                firstNameSenderMax: firstNameSenderMax,
                lastNameSenderMax: lastNameSenderMax,
                companySenderMax: companySenderMax,
                firstNameDestMax: firstNameDestMax,
                lastNameDestMax: lastNameDestMax,
                companyDestMax: companyDestMax,
                zipSenderMaxLength: zipSenderMaxLength,
                zipDestMaxLength: zipDestMaxLength,
                address1SenderMax: address1SenderMax,
                address2SenderMax: address2SenderMax,
                address1DestMax: address1DestMax,
                address2DestMax: address2DestMax,
                citySenderMaxLength: citySenderMaxLength,
                cityDestMaxLength: cityDestMaxLength
            }

        }
        else {
            return null;
        }
    }
    
}
