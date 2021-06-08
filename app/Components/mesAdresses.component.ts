import { Component, NgZone, Input, Inject, Injectable, EventEmitter, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, HostListener, ApplicationRef, ChangeDetectorRef, Pipe, PipeTransform, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { User } from "../Models/user";
import { Address } from "../Models/address";
import { AddressGroup } from "../Models/addressGroup";
import { AddressService } from "../Services/addresses.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PopoverModule } from 'ngx-popover';
import * as _ from 'underscore';
import { PagerService } from '../services/pager.service';
import { PreparationService } from "../Services/preparation.service";
import { Country } from "../Models/country";
import { AddressFormDestinationComponent } from '../Components/addressFormDestination.component';
import { CountryPipe } from "../Pipes/country";
import { TreeviewConfig, TreeviewItem } from 'ng2-dropdown-treeview';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { TempAddressService } from "../Services/tempAddress.service";
import { Tab } from "../Tab/tab";
import { Tabs } from "../Tab/tabs";
import { TempAddressForGroup } from "../Models/tempAddressForGroup";
import { AppConfig } from '../app.config';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ConfirmDialog } from '../Components/confirm-dialog.component';
import { DialogsService } from '../Services/dialogs.service';
import { AuthenticationService } from '../Services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination';


var configurationGlobal = new AppConfig();
const urlAdr = configurationGlobal.apiUrl + 'api/File/addressForAddressGroups';

@Component({
	moduleId: module.id,
	selector: 'mesAdresses',
	templateUrl: '../Views/Publipostage/mesAdresses.component.html',
	providers: [PagerService, User]
})
export class MesAdressesComponent implements OnInit { 
	@Input() class: string;
	@ViewChild(AddressFormDestinationComponent) addressFormDestinationComponent: AddressFormDestinationComponent;
	@BlockUI() blockUI: NgBlockUI;
	title: string;
	selectedAddress: Address;
	selectedAddressGroup: AddressGroup;
	addresses: Address[];
	errorMessage: string;
	showMobileMenu: boolean;
	showMoreInfo: boolean;
	toggle = {};
	pager: any = {};
	pagedItems: any[];
	pageSize: number;
	totalAdresses: number;
	keyword: string;
	filteredAddresses: Address[];
	totalFilteredAddresses: number;
	addressGroups: AddressGroup[];
	newDestinationAddress: Address;
	countries: Country[];
	showArchived: boolean;
	files: UploadFile[];
	stopPropagationAdr: boolean;
	CSVDocumentName: string;
	uploadInput: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	showLoading: boolean;

	addressGroupsMultiselectItems: TreeviewItem[];
	addressGroupsMultiselectValues: any[];
	configAddressGroup: TreeviewConfig = {
		isShowAllCheckBox: false,
		isShowFilter: false,
		isShowCollapseExpand: false,
		maxHeight: 500
    };

    
    
	//addresses upload modal
	@ViewChild('closeModal') closeModal: ElementRef;
	@ViewChild(Tabs) tabsComponent: Tabs;
	@ViewChildren(Tab) tabs: QueryList<Tab>;
	@ViewChild('uploadfilebutton') uploadfilebuttonElRef: ElementRef
	hideOkMessageAdr: boolean;
	hideErrorMessageAdr: boolean;
	errorMessageAdr: string;
	incorrectAddresses: TempAddressForGroup[];
	correctAddress: TempAddressForGroup[];
	previewAddress: TempAddressForGroup[];
	selectedTab: Tab;
	addressForm: FormArray;
	addressesHasError: boolean;
	hideAddressListModal: boolean;
	hideProgress: boolean;
	accessRightID: number;
	responseUpd: any;
	message: string;
	newGroupName: string;

	public PagingConfig: PaginationInstance;

	constructor(private service: AddressService, private auth: AuthenticationService, private router: Router, private pagerService: PagerService, private user: User, private preparationService: PreparationService, private dialogsService: DialogsService, private tempAddressService: TempAddressService)
	{
        // this.user = JSON.parse(localStorage.getItem('currentUser'));


		this.pageSize = 10;
		this.keyword = "";
		this.totalAdresses = 0;
		this.totalFilteredAddresses = 0;
		this.filteredAddresses = [];
		this.newDestinationAddress = new Address();
		this.showArchived = true;

		this.files = []; // local uploading files array
		this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
		this.humanizeBytes = humanizeBytes;
		this.CSVDocumentName = '';

		this.incorrectAddresses = new Array<TempAddressForGroup>();
		this.hideOkMessageAdr = true;
		this.hideErrorMessageAdr = true;
		this.hideAddressListModal = true;
		this.hideProgress = true;
		this.showLoading = true;
		this.newGroupName = "";


		this.PagingConfig = {
			id: 'destinaires',
			itemsPerPage: 10,
			currentPage: 1,
			totalItems: 0
		}
	}

    ngOnInit() {
        //if (this.auth.loggedIn()) {
        //    this.auth.startupTokenRefresh();
        //}   
        this.getPagedAddresses();
        this.getAddressGroups();
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
    }

	onSelect(address: Address) {
		this.selectedAddress = address;
		 
	}

	reloadAddressForm()
	{
		if (this.addressFormDestinationComponent)
		{
			this.addressFormDestinationComponent.ngOnChanges();
		}
	}

	addNewAddress()
    {
        this.selectedAddress = new Address();
		this.resetNewAddress();
		//this.selectedAddress = this.newDestinationAddress;
		this.reloadAddressForm();

	  
	}

	onSelectGroup(group: AddressGroup) {
		if (group != null) {
			this.selectedAddressGroup = group;
			this.getPagedAddresses();
		 
		}
		else {
			this.selectedAddressGroup = null;
			this.getPagedAddresses();
		  
		}      
	}

	editAddressGroupName() {
	   
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

    searchAddress() {
        this.getPagedAddresses();
    }

    removeSearch() {
        this.keyword = "";
        this.getPagedAddresses();
    }

	//searchAddress() {
	//	let keyword: string = this.keyword.toUpperCase();
	//	this.filteredAddresses = this.addresses.filter(x => (x.Address1 && x.Address1.toUpperCase().includes(keyword)) ||
	//		(x.Address2 && x.Address2.toUpperCase().includes(keyword)) ||
	//		(x.City && x.City.toUpperCase().includes(keyword)) ||
	//		(x.Company && x.Company.toUpperCase().includes(keyword)) ||
	//		(x.Firstname && x.Firstname.toUpperCase().includes(keyword)) ||
	//		(x.Lastname && x.Lastname.toUpperCase().includes(keyword)));
	//	this.setPage(1);
	//}
    
    changePageSize(value: number) {
        this.PagingConfig.itemsPerPage = value;
        this.getPagedAddresses();
		//this.setPage(1);
	}

	getPagedAddresses() {
		this.showLoading = true;
		var addresses;
		//this.PagingConfig.currentPage = 1;
        let group = this.selectedAddressGroup ? this.selectedAddressGroup.AddressGroupID : 0;
        this.auth.getUser()
            .subscribe((response) => {
                this.user = JSON.parse(response._body);
                addresses = this.service.getAllAddresses(this.user, this.PagingConfig.currentPage, this.PagingConfig.itemsPerPage, group, this.showArchived, this.keyword);
                addresses.subscribe(
                    data => {
                        this.addresses = data["data"];
                        this.PagingConfig.totalItems = data["count"];
                        this.showLoading = false;
                    },
                    error => { this.errorMessage = <any>error }
                );

        },
            error => {
                this.errorMessage = <any>error;
                this.showLoading = false;
            }
            );
       
	}

	onPageChange(pageNumber: number) {
		this.showLoading = true;
		this.addresses = [];
        var addresses;
        this.auth.getUser()
            .subscribe((response) => {
                this.user = JSON.parse(response._body);
                let group = this.selectedAddressGroup ? this.selectedAddressGroup.AddressGroupID : 0;
                addresses = this.service.getAllAddresses(this.user, pageNumber, this.PagingConfig.itemsPerPage, group, this.showArchived, this.keyword);
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
        
	getAddressGroups() {
		var addressGroups = null;
		this.showLoading = true;
		this.auth.getUser()
			.subscribe((response) => {
				this.user = JSON.parse(response._body);
				
					addressGroups = this.service.getAddressGroups(this.user.Useremail);

					addressGroups.subscribe(
						addressGroups => {
							this.addressGroups = addressGroups;
							this.addressGroupsMultiselectItems = this.getAddressGroupsMultiselectItems();
						},
						error => this.errorMessage = <any>error
					);
				},
			error => this.errorMessage = <any>error
		);
		this.showLoading = false;
	}

	insertAddressGroup(groupName) {
		var response = null;

		response = this.service.insertAddressGroup(groupName, this.user.Useremail);
		response.subscribe(
			response => {
				this.getAddressGroups();
				this.newGroupName = "";
			},
			error => this.errorMessage = <any>error
		);
	}

	deleteAddressGroup()
	{
		var response = null;

		response = this.service.deleteAddressGroup(this.selectedAddressGroup);
		response.subscribe(
			response => {
				this.onSelectGroup(null);
				this.getAddressGroups();
			},
			error => this.errorMessage = <any>error
		);
	}

	changeGroupName()
	{
		var response = null;

		response = this.service.changeGroupName(this.selectedAddressGroup);
		response.subscribe(
			response => {

			},
			error => this.errorMessage = <any>error
		);
	}

	resetNewAddress() {
		this.newDestinationAddress.AddressID = null;
		this.newDestinationAddress.Civilite = null;
		this.newDestinationAddress.Lastname = null;
		this.newDestinationAddress.Firstname = null;
		this.newDestinationAddress.Company = null;
		this.newDestinationAddress.Address1 = null;
		this.newDestinationAddress.Address2 = null;
		this.newDestinationAddress.ZipPostalCode = null;
		this.newDestinationAddress.City = null;
		this.newDestinationAddress.CountryID = null;
		this.newDestinationAddress.IsPrimaryAddress = null;
	}

	toggleShowArchived() {
		this.showArchived = !this.showArchived;
        this.getPagedAddresses();
	}

	getAddressGroupsMultiselectItems(): TreeviewItem[] {

		var json = JSON.stringify(this.addressGroups);

		var items = new Array<TreeviewItem>();

		this.addressGroups.forEach(group => {
			var item = new TreeviewItem({
				text: group.GroupName, value: group.AddressGroupID, checked: false
			});
			items.push(item);
		});

		return items;
	}

	check(output: UploadOutput) {
		if (this.stopPropagationAdr != false) {
			if (output.type === 'addedToQueue') {
				if (this.CSVDocumentName == "") {
					this.hideErrorMessageAdr = true;
					this.hideOkMessageAdr = true;
					this.onUploadOutput(output);
				}
				else {
					let dialogRef: MdDialogRef<ConfirmDialog>;
					let filename = this.CSVDocumentName;
					dialogRef = this.dialogsService.confirm('Êtes-vous sûr de vouloir écraser le fichier?', filename);
					var ret;
					dialogRef.afterClosed().subscribe(result => {
						ret = result;
					 
						if (ret == true) {
							var outputStart = output;
							outputStart.type = 'allAddedToQueue';

							this.clearIncorrectFormArray();
							this.addressGroupsMultiselectItems = this.getAddressGroupsMultiselectItems();
							this.addressGroupsMultiselectValues = [];
							this.CSVDocumentName = '';
							this.incorrectAddresses = new Array<TempAddressForGroup>();
							this.hideErrorMessageAdr = true;
							this.hideOkMessageAdr = true;
							this.files = new Array<UploadFile>();
							this.previewAddress = new Array<TempAddressForGroup>();

							var message = this.tempAddressService.deleteTempAddressesForAddressGroups(this.accessRightID);
							message.subscribe(
								message => {
									this.files.push(output.file);
									this.stopPropagationAdr = true;
									this.onUploadOutput(outputStart);
								},
								error => this.errorMessage = <any>error
							);
						}
						else {
							this.uploadInput.emit({ type: 'cancel', id: output.file.id });
							this.stopPropagationAdr = true;
						}
					});
					this.stopPropagationAdr = false;
				}
			}
			else {
				this.onUploadOutput(output);
			}
		}
	}

	onUploadOutput(output: UploadOutput): void {
	  

		if (output.type === 'allAddedToQueue') { // when all files added in queue
			// uncomment this if you want to auto upload files when added
			const event: UploadInput = {
				type: 'uploadAll',
				url: urlAdr,
				method: 'POST',
				fieldName: 'uploadInputAdr',
				data: {
					AccessRightID: this.accessRightID.toString()
				}
			};
			this.uploadInput.emit(event);
		} else if (output.type === 'addedToQueue') {
			this.files.push(output.file);
		} else if (output.type === 'uploading') {
			// update current data in files array for uploading file
			const index = this.files.findIndex(file => file.id === output.file.id);
			this.files[index] = output.file;
			this.blockUI.start();
		} else if (output.type === 'removed') {
			// remove file from array when removed
			this.files = this.files.filter((file: UploadFile) => file !== output.file);
		} else if (output.type === 'dragOver') { // drag over event
			this.dragOver = true;
		} else if (output.type === 'dragOut') { // drag out event
			this.dragOver = false;
		} else if (output.type === 'drop') { // on drop event
			this.dragOver = false;
		} else if (output.type === 'done') {
			if (output.file.response["Message"] == "OK") {
				this.CSVDocumentName = output.file.name;
				this.message = output.file.response["Message"];
				this.hideOkMessageAdr = false;
				this.hideErrorMessageAdr = true;
			}
			else {
				this.hideErrorMessageAdr = false;
				this.hideOkMessageAdr = true;
				this.errorMessageAdr = output.file.response["Message"];
			}
			this.uploadfilebuttonElRef.nativeElement.value = '';
			this.blockUI.stop();
		}
	}

	startUpload(): void {  // manually start uploading
		const event: UploadInput = {
			type: 'uploadAll',
			url: '/upload',
			method: 'POST',
			data: { foo: 'bar' } // set sequential uploading of files with concurrency 1
		}

		this.uploadInput.emit(event);
	}

	cancelUpload(id: string): void {
		this.uploadInput.emit({ type: 'cancel', id: id });
		this.files = new Array<UploadFile>();
	}

	ResetUploadCSV() {
		let message: any;

		this.selectTab(0);
		this.clearIncorrectFormArray();
		this.addressGroupsMultiselectItems = this.getAddressGroupsMultiselectItems();
		this.addressGroupsMultiselectValues = [];
		this.CSVDocumentName = '';
		this.incorrectAddresses = new Array<TempAddressForGroup>();
		this.hideErrorMessageAdr = true;
		this.hideOkMessageAdr = true;
		this.files = new Array<UploadFile>();
		this.previewAddress = new Array<TempAddressForGroup>();

		message = this.tempAddressService.deleteTempAddressesForAddressGroups(this.accessRightID);
		message.subscribe(
			message => {
				this.message = message;
			},
			error => this.errorMessage = <any>error
		);

		return message;
	}

	selectTab(index: number) {
		if (index == 0) {
			this.select(index);
		}
		else if (index == 1) {
			var tempAddress = null;

			if (this.incorrectAddresses.length != 0)
			{
				this.select(index);
			}
			else
			{
				tempAddress = this.tempAddressService.getIncorrectAddressForAddressGroups(this.accessRightID);
				tempAddress.subscribe(
					tempAddress => {
						this.incorrectAddresses = tempAddress;
						let lenght = this.incorrectAddresses.length;
						if (this.incorrectAddresses.length == 0) {
							this.selectTab(2);
						}
						else {
							this.select(index);
						}
					},
					error => this.errorMessage = <any>error
				);
			}

		}
		else if (index == 2) {
			this.select(index);
			let response: any;
			let FirstLine;

			this.correctAddress = this.addressForm.getRawValue().map(item => item as TempAddressForGroup);

			if (this.correctAddress.length > 0)
			{
				for (let i = 0; i < this.correctAddress.length; i++) {
					this.correctAddress[i].AccessRightID = this.accessRightID
				}

				response = this.tempAddressService.updateAddressesForAddressGroups(this.correctAddress);
				response.subscribe(
					response => {
						this.responseUpd = response;
					},
					error => this.errorMessage = <any>error
				);
			}
		}
		else if (index == 3) {

			var tempAddress = null;
			var response = null;

			tempAddress = this.tempAddressService.getAddressPreviewForAddressGroups(this.accessRightID);
			tempAddress.subscribe(
				tempAddress => {
					this.previewAddress = tempAddress;
					this.select(index);
				},
				error => this.errorMessage = <any>error
			);
		}
	}

	goBack()
	{
		let tabArray: Array<Tab> = this.tabs.toArray();
		var index = tabArray.findIndex(x => x.title == this.selectedTab.title);
		if (index > 0)
		{
			if (index == 2 && this.incorrectAddresses.length == 0)
			{
				index--;
			}
			this.select(index - 1);
		}
		else
		{
			this.closeModal.nativeElement.click();
		}
	}

	private select(index: number) {
		let tabArray: Array<Tab> = this.tabs.toArray();
		this.selectedTab = tabArray[index];
		this.tabsComponent.selectTab(this.selectedTab);
	}

	initTabs()
	{
		if (this.selectedTab == null)
		{
			this.ResetUploadCSV();
		}
	}

	onSubmit(form: FormGroup) {
		this.selectTab(2);
	}

	public clearIncorrectFormArray() {
		this.addressForm = new FormArray([]);
	}

	removeAddress(event) {
		this.incorrectAddresses = event;
	}

	importAddresses()
	{
		var importAddresses = this.service.importAddresses(this.accessRightID, this.addressGroupsMultiselectValues);

		importAddresses.subscribe(
			(importAddresses) => {
				this.onSelectGroup(this.selectedAddressGroup);
			},
			error => this.errorMessage = <any>error
		);
	}

}
