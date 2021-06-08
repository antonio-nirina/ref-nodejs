import { DialogsService } from '../Services/dialogs.service';
import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { ConfirmDialog } from '../Components/confirm-dialog.component';
import { UpdateDialog } from '../Components/update-dialog.component';
import { ErrorDialog } from '../Components/error-dialog.component';

@NgModule({
    imports: [
        MaterialModule,
    ],
    exports: [
        ConfirmDialog, UpdateDialog, ErrorDialog
    ],
    declarations: [
        ConfirmDialog, UpdateDialog, ErrorDialog
    ],
    providers: [
        DialogsService,
    ],
    entryComponents: [
        ConfirmDialog, UpdateDialog, ErrorDialog
    ],
})
export class DialogsModule { }
