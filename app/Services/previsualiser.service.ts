import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, RequestMethod, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from '../Services/index';

@Injectable()
export class PrevisualiserService {
    constructor(private http: Http,
        private authenticationService: AuthenticationService) { }

    private baseUrl = "api/Previsualiser/"; // web api URL

    // calls the [Post] /api/File/GetPreviewLetters/ Web API method.
    getPreviewLetters(): Observable<boolean> {

        var url = this.baseUrl + "GetPreviewLetters/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getBinaryLetter(letterID): Observable<boolean> {
        var url = this.baseUrl + "GetBinaryLetter/";
        return this.http.post(url, JSON.stringify(letterID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    confirmPublipostage(): Observable<boolean> {
        var url = this.baseUrl + "ConfirmPublipostage/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    setScheduledDate(ScheduledDate: string): Observable<boolean> {

        var url = this.baseUrl + "SetScheduledDate/";

        return this.http.post(url, JSON.stringify(ScheduledDate), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    cancelSheduledDate(): Observable<boolean> {

        var url = this.baseUrl + "CancelSheduledDate/";

        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    
    getDateLaPoste(): Observable<boolean> {

        var url = this.baseUrl + "DateForSending/";

        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // output errors to the console.
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }

    private getRequestOptions() {
        this.authenticationService.loggedIn();
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
