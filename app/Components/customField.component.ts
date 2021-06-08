import { Component, Input, Output, EventEmitter, trigger, transition, style, animate } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TempAddress } from "../Models/tempAddress";
import { TempAddressService } from "../Services/tempAddress.service";
import { DocumentVariable } from "../Models/documentVariable";
import { Country } from "../Models/country";
import { AdditionalCSVHeader } from "../Models/additionalCSVHeader";

@Component({
    moduleId: module.id,
    selector: '[my-tbody-custom-field]',
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({ transform: 'translateY(100%)', opacity: 0 }),
                    animate('300ms', style({ transform: 'translateY(0)', opacity: 1 }))
                ]),
                transition(':leave', [
                    style({ transform: 'translateY(0)', opacity: 1 }),
                    animate('500ms', style({ transform: 'translateY(100%)', opacity: 0 }))
                ])
            ]
        )
    ],
    templateUrl: '../Views/Publipostage/customField.component.html'
})
export class CustomField {
    @Input('address') adr: TempAddress;
    //@Input('list') addresses: TempAddress[];
    @Input('adrFr') customFieldsForm: FormArray;
    @Input('index') index: number;
    @Input('maxLenght') maxLenght: number;
    @Input('customHeadersForAddressGroups') customHeadersForAddressGroups: AdditionalCSVHeader[];
    @Input('countries') countries: Country[];
    @Input('page') page: number;
    @Input('pageSize') pageSize: number;

    @Output('adrFr') test = new EventEmitter();
    @Output() public valueChanged: EventEmitter<any> = new EventEmitter<any>();

    set adrFr(val) {
        this.customFieldsForm = val;
        this.test.emit(this.customFieldsForm)
    }

    address: TempAddress;

    constructor(private _fb: FormBuilder,
        private tempAddressService: TempAddressService) {
    }

    ngOnInit() {


        const tempGroup: FormGroup = new FormGroup({});
        

        for (let i = 0; i < this.customHeadersForAddressGroups.length; i++) {
            const control: FormControl = new FormControl(this.customHeadersForAddressGroups[i].Values[this.index + (this.page - 1) * this.pageSize].Value, Validators.maxLength(this.maxLenght));
        
            tempGroup.addControl(this.customHeadersForAddressGroups[i].HeaderName, control);
            control.valueChanges.forEach(
                (value: string) => {
                    this.updateValue(value, i);
                });
        }
        this.customFieldsForm.controls.push(tempGroup);
    }

    updateValue(value, i)
    {
        this.customHeadersForAddressGroups[i].Values[this.index + (this.page - 1) * this.pageSize].Value = value;
        this.valueChanged.emit();
    }

}
