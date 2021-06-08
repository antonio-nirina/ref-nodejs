import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReglementMessageService {
    private _url: string;

    contentUrlChange$: EventEmitter<any>;

    constructor() {
        this.contentUrlChange$ = new EventEmitter;
    };

    setURL(url: string): void {
        this._url = url;
        this.contentUrlChange$.emit(url);
    };
}