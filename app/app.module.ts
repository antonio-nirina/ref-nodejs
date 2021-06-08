import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Http, HttpModule, XHRBackend, RequestOptions, Response } from '@angular/http';
import { CommonModule } from "@angular/common";

/*import { fakeBackendProvider } from './Helpers/fake-backend';*/
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http'
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { MaterialModule, MdDialogRef, MdDialog, MdDialogConfig} from '@angular/material';
import { AppRoutingModule, routingComponents } from "./app.routing";
import "rxjs/Rx";
import { NgUploaderModule } from 'ngx-uploader';
import { NgxPaginationModule } from 'ngx-pagination';
import { CountdownService, countdownOptions, countdownData, CountdownComponent } from 'ng2-countdown/index';
import { CountdownCustomComponent } from './Components/countdownCustom.component';
import { TarifsCalculerComponent } from './Components/tarifsCalculer.component';
import { AuthenticatedHttpService } from './AuthenticatedHttpService';
import { PopoverModule } from 'ngx-popover';
import { SortableDirective } from './Directives/sortable.directive';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { DropdownTreeviewModule } from 'ng2-dropdown-treeview';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
//**Components

//**Services
import { AddressService } from './Services/addresses.service';
import { PreparationService } from "./Services/preparation.service";
import { TempAddressService } from "./Services/tempAddress.service";
import { CountdownMessageService } from "./Services/countdownMessage.service";
import { MailingService } from "./Services/mailing.service";
import { MonCompteService } from "./Services/moncompte.service";
import { LoginComponent } from './Components/login.component';
import { VideoComponent } from './Components/video.component';
import { HelpComponent } from './Components/help.component';
import { LoginViewComponent } from './login.component';
import { LoginCompleteComponent } from './Components/loginComplete.component';
import { ExpediteurComponent } from './Components/expediteur.component';
import { NavigationComponent } from './navigation.component';
import { ConfirmationLoginComponent } from './Components/confirmation-login.component';
import { RegisterComponent } from './Components/register.component';
import { PasswordForgetComponent } from './Components/passwordforgot.component';
import { NewPasswordComponent } from './Components/newpassword.component';
import { PrevisualiserComponent } from './Components/previsualiser.component';
import { ConfirmationComponent } from './Components/confirmation.component';
import { AlertComponent } from './Components/alert.component';
import { AddressFormComponent } from './Components/addressForm.component';
import { AdressPrincipaleComponent } from './Components/adressPrincipale.component';
import { AddressFormDestinationComponent } from './Components/addressFormDestination.component';
import { AddressFormExpediteurComponent } from './Components/addressFormExpediteur.component';
import { MonMailing } from './Components/monMailing.component';
import { SelectableDropdown } from './Components/selectableDropdown.component';
import { PrevisualiserService } from "./Services/previsualiser.service";
import { SharedService } from "./Services/shared.service";
import { MesMailingService } from "./Services/mesMailing.service";

import { PagerService } from "./Services/pager.service";
import { CapitalizePipe } from "./Pipes/capitalize.pipe";
import { CountryPipe } from "./Pipes/country";
import { LetterTypePipe } from "./Pipes/letterType";
import { CountdownFormatFrenchPipe } from "./Pipes/pipes";
import { VariablePipe } from "./Pipes/variable";

import { Tabs } from './Tab/tabs';
import { TabsSender } from './Tab/tabsSender';
import { Tab } from './Tab/tab';
import { IncorrectAddress } from './Components/incorrectAddress.component';
import { IncorrectAddressForGroup } from './Components/incorrectAddressForGroup.component';
import { CustomField } from './Components/customField.component';
import { AuthGuard } from './Guard/index';
import { AuthenticationService, UserService } from './Services/index';
import { AlertService } from './Services/alert.service';
import { AppConfig } from './app.config';
import { MonCompteComponent } from "./Components/monCompte.component";
import { BlockWithProgress } from "./Components/BlockWithProgress.component";

import { DialogsModule } from './Modules/dialogs.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReglementComponent } from './Components/reglement.component';
import { ConfirmationHelperComponent } from './Components/confirmation-helper.component';
import { ReglementMessageService } from './Services/reglementMessage.service';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { CookieService } from 'ng2-cookies';
import { DatexPipe } from './Pipes/datex.pipe';
//import { JwtConfigService, JwtHttp } from 'angular2-jwt-refresh';



export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig(), http, options);
}

//import { ReglementServiceFactory } from './Services/reglementServiceFactory';

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, AppRoutingModule, NgUploaderModule, NgxPaginationModule, MaterialModule, ReactiveFormsModule, PopoverModule, DialogsModule, BrowserAnimationsModule, MultiselectDropdownModule, DropdownTreeviewModule.forRoot(), BlockUIModule, NgxMyDatePickerModule.forRoot(), PasswordStrengthMeterModule],
    declarations: [AppComponent, routingComponents, Tabs, TabsSender, Tab, IncorrectAddress, IncorrectAddressForGroup, CustomField, CountryPipe, CapitalizePipe, LetterTypePipe, VariablePipe, CountdownFormatFrenchPipe, DatexPipe, CountdownComponent, CountdownCustomComponent, LoginComponent, LoginViewComponent, VideoComponent, HelpComponent, LoginCompleteComponent, RegisterComponent, PasswordForgetComponent, SortableDirective, NavigationComponent, PrevisualiserComponent, NewPasswordComponent, AlertComponent, AddressFormComponent, AdressPrincipaleComponent, AddressFormDestinationComponent, MonCompteComponent, MonMailing, SelectableDropdown, ReglementComponent, ConfirmationHelperComponent, TarifsCalculerComponent, BlockWithProgress, ConfirmationLoginComponent, VideoComponent, AddressFormExpediteurComponent],
    entryComponents: [BlockWithProgress],
	bootstrap: [AppComponent],
    providers: [{
        provide: AuthHttp,
        useFactory: authHttpServiceFactory,
        deps: [Http, RequestOptions]
    }, { provide: Http, useClass: AuthenticatedHttpService }, AuthGuard, AuthenticationService, UserService,/* fakeBackendProvider,*/ MockBackend, BaseRequestOptions, AddressService, PreparationService, TempAddressService, MailingService, PagerService, CountdownMessageService, CountdownService, AppConfig, SharedService, PrevisualiserService, AlertService, MonCompteService, MesMailingService, ReglementMessageService, CookieService]
	   
})



export class AppModule { }

