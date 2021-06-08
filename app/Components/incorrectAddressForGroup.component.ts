import { Component, Input, Output, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TempAddressService } from "../Services/tempAddress.service";
import { TempAddressForGroup } from "../Models/tempAddressForGroup";
import { Country } from "../Models/country";

@Component({
    moduleId: module.id,
    selector: '[my-tbody-forGroups]',
    templateUrl: '../Views/Publipostage/incorrectAddressForGroup.component.html'

})
export class IncorrectAddressForGroup {
    @Input('address') adr: TempAddressForGroup;
    @Input('list') addresses: TempAddressForGroup[];
    @Input('countries') countries: Country[];
    @Input('adrFr') addressForm: FormArray;
    @Input('index') index: number;

    errorMessage: string;

    constructor(private _fb: FormBuilder,
        private tempAddressService: TempAddressService) { }

    ngOnInit() {
        const farray = this.addressForm;
        var ad = this.initAddress(this.adr);
        farray.push(ad);
    }

    initAddress(adr: TempAddressForGroup) {
        return this._fb.group({
            TempAddressID: new FormControl(adr.TempAddressID),
            FirstName: new FormControl(adr.FirstName, Validators.maxLength(18)),
            LastName: new FormControl(adr.LastName, Validators.maxLength(18)),
            Company: new FormControl(adr.Company, Validators.maxLength(38)),
            Address1: new FormControl(adr.Address1, [Validators.required, Validators.maxLength(38)]),
            Address2: new FormControl(adr.Address2, Validators.maxLength(38)),
            ZipPostalCode: new FormControl(adr.ZipPostalCode, Validators.maxLength(10)),
            City: new FormControl(adr.City, [Validators.required, Validators.maxLength(27)]),
            CountryID: new FormControl(adr.CountryID, Validators.required)
        },
            {
                validator: this.customValidator.bind(this)
            });
    }

    delete(adr: TempAddressForGroup) {
        var message = null;
        message = this.tempAddressService.deleteTempAddressForAddressGroups(adr.TempAddressID);
        message.subscribe(
            message => {
            },
            error => this.errorMessage = <any>error
        );

        var index = this.addresses.indexOf(this.adr);
        this.addresses.splice(index, 1);

        const farray = this.addressForm;
        farray.removeAt(this.index);
    }

    customValidator(group: FormGroup) {

        let noDest: boolean = false;
        let firstNameMax: boolean = false;
        let lastNameMax: boolean = false;
        let companyMax: boolean = false;
        let zipMaxLength: boolean = false;
        let cityMaxLength: boolean = false;
        let address1Max: boolean = false;
        let address2Max: boolean = false;

        let firstnameD: boolean = group.controls["FirstName"].value == "" || group.controls["FirstName"].value == null ? false : true;
        let lastnameD: boolean = group.controls["LastName"].value == "" || group.controls["LastName"].value == null ? false : true;
        let companyD: boolean = group.controls["Company"].value == "" || group.controls["Company"].value == null ? false : true;

        if (!(firstnameD || lastnameD || companyD)) {
            noDest = true;
        }

        if (firstnameD && group.controls["FirstName"].value.length > 18) {
            firstNameMax = true;
        }
        if (lastnameD && group.controls["LastName"].value.length > 18) {
            lastNameMax = true;
        }
        if (companyD && group.controls["Company"].value.length > 38) {
            companyMax = true;
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

        let noCountryDest: boolean = false;
        noCountryDest = (group.controls["CountryID"].value == null || group.controls["CountryID"].value == 0) ? true : false;

        let zipCodeLenghtD: boolean = false;

        let zipcodeD = group.controls["ZipPostalCode"];
        let zipcodeStringD: string = zipcodeD.value;

        const countryD = group.controls["CountryID"].value;
        if (countryD && (countryD == 1)) {
            if (zipcodeStringD.length != 5)
            {
                zipCodeLenghtD = true;
            }
        }
        else {
            if (zipcodeStringD.length > 10)
                zipMaxLength = true;
        }

        if (noDest || zipCodeLenghtD || noCountryDest || firstNameMax || lastNameMax || companyMax || zipMaxLength || address1Max || address2Max || cityMaxLength) {
            return {
                noDest: noDest,
                zipCodeLenghtD: zipCodeLenghtD,
                noCountryDest: noCountryDest,
                firstNameMax: firstNameMax,
                lastNameMax: lastNameMax,
                companyMax: companyMax,
                zipMaxLength: zipMaxLength,
                address1Max: address1Max,
                address2Max: address2Max,
                cityMaxLength: cityMaxLength
            }
        }
        else {
            return null;
        }
    }

}
