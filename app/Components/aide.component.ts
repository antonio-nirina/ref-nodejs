import { Component } from '@angular/core';
import { AuthenticationService } from '../Services/index';
declare var $: any;

//import { SimplePageScrollConfig } from 'ng2-simple-page-scroll';
@Component({
    selector: 'aide',
    templateUrl: './src/app/Views/Publipostage/aide.component.html'
})

export class AideComponent  {

    //constructor() {
    //    SimplePageScrollConfig.defaultScrollOffset = 0;
    //}

    constructor(private auth: AuthenticationService) {}


    ngOnInit() {
		if ($("#aide-component").length) {
			$("#aide-component").affix({
				offset: { top: 110, bottom: 300 }
			});
		}
        //if (this.auth.loggedIn()) {
        //    this.auth.startupTokenRefresh();
        //}
    }

    goTo(location: string): void {
        window.location.hash = location;
    }
}
