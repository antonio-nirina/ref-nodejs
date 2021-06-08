import { MdDialogRef } from '@angular/material';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { DialogsService } from '../Services/dialogs.service';
import { UploadOutput } from 'ngx-uploader';


@Component({
    selector: 'update-dialog',
    template: `
        <p>{{ title }}</p>
        <p class="mb-20">{{ message }}</p>
        <button type="button" class="btn-blue" 
          (click)="dialogRef.close(true)" >Créer nouvelle adresse</button>
        <button type="button" class="btn-white"
            (click)="dialogRef.close(false)">Mettre à jour adresse</button>
    `,
})
export class UpdateDialog {

    public title: string;
    public message: string;
    public output: UploadOutput;
 
  
    

    constructor(public dialogRef: MdDialogRef<UpdateDialog>) {
    }


}