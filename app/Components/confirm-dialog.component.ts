import { MdDialogRef } from '@angular/material';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { DialogsService } from '../Services/dialogs.service';
import { UploadOutput } from 'ngx-uploader';

import { AuthenticationService } from '../Services/index';


@Component({
    selector: 'confirm-dialog',
    template: `
        <p>{{ title }}</p>
        <p class="mb-20">{{ message }}</p>
        <button type="button" class="btn-blue" 
          (click)="dialogRef.close(true)" >Confirmer</button>
        <button type="button" class="btn-white"
            (click)="dialogRef.close(false)">Annuler</button>
    `,
})
export class ConfirmDialog {

    public title: string;
    public message: string;
    public output: UploadOutput;
 
  
    

    constructor(public dialogRef: MdDialogRef<ConfirmDialog>, private auth: AuthenticationService) {
    }

    ngOnInit() {

        //if (this.auth.loggedIn()) {
        //    this.auth.startupTokenRefresh();
        //}
     
    }
}
