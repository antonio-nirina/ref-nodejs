import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from '../Services/index';

@Injectable()
export class CountdownMessageService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }
    private baseUrl = "api/Preparation/"; // web api URL
    // calls the [GET] /api/Preparation/Get/ Web API method.
    getCountdownMessage() {
        var url = this.baseUrl + "CountdownMessage/";
        return this.http.get(url, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // output errors to the console.
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }

    private getRequestOptions() {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token, "Content-Type": "application/json", "MG": sessionStorage.getItem("MG") });
        let options = new RequestOptions({ headers: headers });
        //return new RequestOptions({
        //    headers: new Headers({
        //        "Content-Type": "application/json"
        //    })
        //});
        return options;
    }
}