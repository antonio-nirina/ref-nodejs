import { Component } from '@angular/core';
import { AuthenticationService } from '../Services/index';


//import { SimplePageScrollConfig } from 'ng2-simple-page-scroll';
@Component({
	selector: 'mobile-menu',
	templateUrl: './src/app/Views/Publipostage/mobile-menu.component.html'
})

export class MobileMenuComponent {

	//constructor() {
	//    SimplePageScrollConfig.defaultScrollOffset = 0;
	//}

	constructor(private auth: AuthenticationService) { }


	ngOnInit() {

		//if (this.auth.loggedIn()) {
		//    this.auth.startupTokenRefresh();
		//}
	}

	goTo(location: string): void {
		window.location.hash = location;
	}
}
