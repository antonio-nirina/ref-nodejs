import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'datex'
})

export class DatexPipe implements PipeTransform {

    constructor(protected _sanitizer: DomSanitizer) {

    }
    transform(value: string, timeShow: string=""): string {

        let dd = value.substr(8, 2);
        let MM = value.substr(5, 2);
        let yyyy = value.substr(0, 4);
        let date = `${dd}/${MM}/${yyyy}`;

        let time = '';

        //if (type != 'short') {
            let hh = value.substr(11, 2);
            let mm = value.substr(14, 2);
            let ss = value.substr(17, 2);
            time = `${hh}h${mm}m`;
        //}

        if (timeShow == 'time') {
            return `${time}`;
        }
        else {
            return `${date}`;
        }
        // return this._sanitizer.bypassSecurityTrustResourceUrl(`${date} <span[outerHTML]="'${time}' | hn:'i.tablet-block'"></span>`);

       
    }
}