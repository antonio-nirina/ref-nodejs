import { Observable } from 'rxjs/Rx';
import { ConfirmDialog } from '../Components/confirm-dialog.component';
import { UpdateDialog } from '../Components/update-dialog.component';
import { ErrorDialog } from '../Components/error-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import { UploadOutput } from 'ngx-uploader';

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) {
      
      
    }

    public confirm(title: string, message: string): MdDialogRef<ConfirmDialog> {

        let dialogRef: MdDialogRef<ConfirmDialog>;
        let config = new MdDialogConfig();
        config.disableClose = true;
        config.height = "200";
        config.width = "300";
        dialogRef = this.dialog.open(ConfirmDialog,config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef;
        //return dialogRef.afterClosed();
    }

    public confirmUpdate(title: string, message: string): MdDialogRef<UpdateDialog> {

        let dialogRef: MdDialogRef<UpdateDialog>;
        let config = new MdDialogConfig();
        config.disableClose = true;
        config.height = "200";
        config.width = "500";
        dialogRef = this.dialog.open(UpdateDialog, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef;
        //return dialogRef.afterClosed();
    }

    public error(title: string, message: string): MdDialogRef<ErrorDialog> {

        let dialogRef: MdDialogRef<ErrorDialog>;
        let config = new MdDialogConfig();
        config.disableClose = true;
        dialogRef = this.dialog.open(ErrorDialog, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef;
        //return dialogRef.afterClosed();
    }
}
