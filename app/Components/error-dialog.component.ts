import { MdDialogRef } from '@angular/material';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { DialogsService } from '../Services/dialogs.service';
import { UploadOutput } from 'ngx-uploader';


@Component({
    selector: 'error-dialog',
    template: `
        <div class="error-title">{{ title }}</div>
        <p class="error-message">{{ message }}</p>
        <div class="text-center mt-20">
        <button type="button" class="btn-blue" 
          (click)="dialogRef.close(true)">OK</button>
        <div>
    `,
})
export class ErrorDialog {

    public title: string;
    public message: string;
    public output: UploadOutput;




    constructor(public dialogRef: MdDialogRef<ErrorDialog>) {
    }


}
