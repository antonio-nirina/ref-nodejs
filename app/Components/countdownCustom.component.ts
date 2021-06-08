import { Component } from '@angular/core';
import { CountdownService, countdownOptions, countdownData, CountdownComponent } from 'ng2-countdown/index';

@Component({
    selector: 'countdownCustom',
    template: '{{date|countdownFormatFrench}}'
})
export class CountdownCustomComponent extends CountdownComponent {

    constructor(private _countdownService2: CountdownService) {
        super(_countdownService2);
    };
    

}
