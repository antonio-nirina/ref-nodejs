import { NgModule } from "@angular/core";
import { Routes, RouterModule,ActivatedRoute, Params } from "@angular/router";
import { HomeComponent } from "./Components/home.component";
import { MesMailingComponent } from "./Components/mesMailing.component";
import { MesAdressesComponent } from "./Components/mesAdresses.component";
import { ExpediteurComponent } from "./Components/expediteur.component";
import { MonCompteComponent } from "./Components/monCompte.component";
import { AideComponent } from "./Components/aide.component";
import { ContactComponent } from "./Components/contact.component";
import { TarifsCalculerComponent } from "./Components/tarifsCalculer.component";
import { TarifsGrilleComponent } from "./Components/tarifsGrille.component";
import { PageNotFoundComponent } from "./Components/page-not-found.component";
import { NewPasswordComponent } from "./Components/newpassword.component";
import { AppComponent } from "./app.component";
import { LoginComponent } from './Components/login.component';
import { AuthGuard } from './Guard/index';
import { RegisterComponent } from './Components/register.component';
import { PrevisualiserComponent } from './Components/previsualiser.component';
import { ConfirmationComponent } from './Components/confirmation.component';
import { ConfirmationHelperComponent } from './Components/confirmation-helper.component';

const appRoutes: Routes = [
    {
        path: 'src',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "mesMailing",
        component: MesMailingComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "aide",
        component: AideComponent
	},
	{
		path: "contact",
		component: ContactComponent
	},
    {
        path: "devis",
        component: TarifsCalculerComponent
    }, 
    {
        path: "monCompte",
        component: MonCompteComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "mesAdresses",
        component: MesAdressesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "expediteurs",
        component: ExpediteurComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "previsualiser",
        component: PrevisualiserComponent
    },
    {
        path: "motdepasse",
        component: NewPasswordComponent
    },
	{
		path: "confirmation",
        component: ConfirmationComponent,
        canActivate: [AuthGuard]
	},
    {
        path: "login",
        component: LoginComponent
    },

    { path: "register", component: RegisterComponent },

    { path: "confirmationHelper", component: ConfirmationHelperComponent },
   
    {
        path: '#',
        component: PageNotFoundComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
    
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

export const routingComponents = [HomeComponent, MesMailingComponent, MesAdressesComponent, ExpediteurComponent, PageNotFoundComponent, AideComponent, ContactComponent, MonCompteComponent, TarifsGrilleComponent, TarifsCalculerComponent, ConfirmationHelperComponent, ConfirmationComponent
];


