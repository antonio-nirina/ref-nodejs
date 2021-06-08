import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { AuthenticationService } from '../Services/index';
import { PrevisualiserService } from "../Services/previsualiser.service";
import { User } from "../Models/user";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'confirmation',
	templateUrl: './src/app/Views/Publipostage/confirmation.component.html'
})

export class ConfirmationComponent {

    user: User;

	@BlockUI() blockUI: NgBlockUI;

	s: any;

	constructor(
		private auth: AuthenticationService,
		private previsualiserService: PrevisualiserService,
		private router: Router,
		private renderer2: Renderer2, @Inject(DOCUMENT) private _document
	) { }

    ngOnInit() {

		this.s = this.renderer2.createElement('script');
		this.s.type = '';
		this.s.src = 'https://bat.bing.com/bat.js';
		this.s.text = ``;
		this.renderer2.appendChild(this._document.body, this.s);

        var response = null;

        response = this.previsualiserService.confirmPublipostage();
		this.blockUI.start();

		this.auth.observeStepHelp.next(21);
        response.subscribe(
            data => {
                if (data.Message == "UPDATE_SUCCESS") {
                    this.auth.getUser()
                        .subscribe((response) => {
                            this.user = JSON.parse(response._body);
                            sessionStorage.clear();
                            this.blockUI.stop();
                        }
                            );
                }
                else {
                    this.router.navigate(['/home']);
                }
            });
	}

	ngOnDestroy() {
		this.renderer2.removeChild(this._document.body, this.s);
	}
	
}