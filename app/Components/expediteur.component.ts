
import { Component, NgZone, Input, Injectable, EventEmitter, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { User } from "../Models/user";
import { Address } from "../Models/address";
import { PreparationService } from "../Services/preparation.service";
import { AuthenticationService } from '../Services/index';
import { AddressService } from "../Services/addresses.service";
import { Country } from "../Models/country";
import { CountryPipe } from "../Pipes/country";
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination';
import { AddressFormExpediteurComponent } from '../Components/addressFormExpediteur.component';


@Component({

    moduleId: module.id,
    selector: 'expediteur',
    templateUrl: '../Views/Publipostage/expediteur.component.html',
    providers: [ User]
})
export class ExpediteurComponent implements OnInit {
    
    @ViewChild(AddressFormExpediteurComponent) addressFormexpediteurComponent: AddressFormExpediteurComponent;
    addresses: Address[];
    user: User;
    showLoading: boolean;
    countries: Country[];
    errorMessage: string;
    addressForm: FormArray;
    accessRightID: number;
    selectedAddress: Address;
    newExpediteurAddress: Address;
    showArchived: boolean;
    pageSize: number;
    toggle = {};
    keyword: string;

    public PagingConfig: PaginationInstance;

    constructor(private service: AddressService, private preparationService: PreparationService, private auth: AuthenticationService) {

        this.newExpediteurAddress = new Address();

        this.PagingConfig = {
            id: 'expediteurs',
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: 0
        }
    }

    ngOnInit() {
        this.keyword = "";

        this.showArchived = true;
        this.getPagedAddresses();
        this.resetNewAddress();

        var countries = null;

        countries = this.preparationService.getAllCountries();
        countries.subscribe(
            countries => {
                this.countries = countries;
                //this.setPage(1);
            },
            error => this.errorMessage = <any>error
        );

        this.addressForm = new FormArray([]);

        this.auth.getUser()
            .subscribe((response) => {
                this.user = JSON.parse(response._body);


                var accessRightID = this.service.getAccessRightByUserID(this.user.Useremail);
                accessRightID.subscribe(
                    accessRightID => {
                        this.accessRightID = accessRightID;
                    },
                    error => this.errorMessage = <any>error
                );
            },
            error => this.errorMessage = <any>error
        );

        this.pageSize = 10;
        
    }

    searchAddress() {
        this.getPagedAddresses();
    }

    removeSearch() {
        this.keyword = "";
        this.getPagedAddresses();
    }

    getPagedAddresses() {
        this.showLoading = true;
        var addresses;
        this.auth.getUser()
            .subscribe((response) => {
                this.user = JSON.parse(response._body);
                //this.PagingConfig.currentPage = 1;
                addresses = this.service.getExpediteurs(this.user, this.PagingConfig.currentPage, this.PagingConfig.itemsPerPage, this.showArchived, this.keyword);
                addresses.subscribe(
                    data => {
                        this.addresses = data["data"];
                        this.PagingConfig.totalItems = data["count"];
                        this.showLoading = false;
                    },
                    error => { this.errorMessage = <any>error }
                );
            }, error => {
                this.errorMessage = <any>error;
                this.showLoading = false;
            });
    }



  

    onPageChange(pageNumber: number) {
        this.showLoading = true;
        this.addresses = [];
        var addresses;
        this.auth.getUser()
            .subscribe((response) => {
                this.user = JSON.parse(response._body);
                addresses = this.service.getExpediteurs(this.user, pageNumber, this.PagingConfig.itemsPerPage, this.showArchived, this.keyword);
                addresses.subscribe(
                    data => {
                        this.addresses = data["data"];
                        this.PagingConfig.totalItems = data["count"];
                        this.PagingConfig.currentPage = pageNumber;
                        this.showLoading = false;
                    },
                    error => this.errorMessage = <any>error
                );

                this.PagingConfig.currentPage;
            },
            error => this.errorMessage = <any>error
            );
    }

    changePageSize(value: number) {
        this.PagingConfig.itemsPerPage = value;
        this.getPagedAddresses();
    }

    onSelect(address: Address) {
        this.selectedAddress = address;

    }

    reloadAddressForm() {
        if (this.addressFormexpediteurComponent) {
            this.addressFormexpediteurComponent.ngOnChanges();
        }
    }


    addNewAddress() {
        this.selectedAddress = new Address();
        this.resetNewAddress();
        //this.selectedAddress = this.newExpediteurAddress;
        this.reloadAddressForm();
    }

    archiveDestinationAddressToggle(address: Address) {
        var response = null;
        response = this.service.archiveDestinationAddressToggle(address.AddressID);
        response.subscribe(
            response => {
                this.getPagedAddresses();

            },
            error => this.errorMessage = <any>error
        );
    }

    resetNewAddress() {
        this.newExpediteurAddress.AddressID = null;
        this.newExpediteurAddress.Civilite = null;
        this.newExpediteurAddress.Lastname = null;
        this.newExpediteurAddress.Firstname = null;
        this.newExpediteurAddress.Company = null;
        this.newExpediteurAddress.Address1 = null;
        this.newExpediteurAddress.Address2 = null;
        this.newExpediteurAddress.ZipPostalCode = null;
        this.newExpediteurAddress.City = null;
        this.newExpediteurAddress.CountryID = null;
        this.newExpediteurAddress.IsPrimaryAddress = null;
    }
    
    toggleShowArchived() {
        this.showArchived = !this.showArchived;
        this.getPagedAddresses();
    }

}