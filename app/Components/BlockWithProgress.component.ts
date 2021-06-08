import { Component, OnInit, Input,  } from '@angular/core';
import { TempAddressService } from '../Services/tempAddress.service';

import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'app-root',
    styles: [`
    :host {
      text-align: center;
      color: #1976D2;
    }
  `],
    template: `
    <div class="block-ui-template">
        <div class="loader"></div>
      <div><strong>chargement...</strong></div>
      <div *ngIf="message == 'address'"><strong></strong></div>
    </div>
  `
})
export class BlockWithProgress {

    constructor(private addressService: TempAddressService) { }

    ngOnInit() {
        //var subscription = Observable.interval(1000).subscribe(x => {
        //    this.addressService.GetTempAddresses(3500).subscribe((res) => {
        //        console.log("respond: " + JSON.stringify(res));
        //        if (res.PercentComplete == null || res.PercentComplete == 100) {

        //        }
        //        else {
        //            this.progressActivePrev = true;
        //            this.progressPercentagePrev = res.PercentComplete;
        //        }
        //        if (res.PercentComplete == 100) {
        //            subscription.unsubscribe();
        //            this.progressPercentagePrev = 100;
        //            console.log("stoped")
        //            this.router.navigate(['/previsualiser']);
        //        }
        //    });
        //});
    }
}