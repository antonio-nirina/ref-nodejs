import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, RequestMethod, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { MailingGroup } from "../Models/mailingGroup";
import { AuthenticationService } from '../Services/index';
@Injectable()
export class MailingService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    private baseUrl = "api/File/"; // web api URL

    address() {

        var url = this.baseUrl + "addresssecond/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }

    GetSenderPresent() {

        var url = this.baseUrl + "GetSenderPresent/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }


    

    // calls the [Post] /api/File/mailingGroup/ Web API method.
    getMailingGroup(){

        var url = this.baseUrl + "MailingGroup/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }

    
    getTotalNumberOfPapers(): Observable<string> {
        var url = this.baseUrl + "GetTotalNumberOfPapers/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }

    // calls the [Post] /api/File/Incorrect/ Web API method.
    updateMailing(model: MailingGroup): Observable<boolean> {

        var url = this.baseUrl + "UpdateMailing/";
        
        return this.http.post(url, JSON.stringify(model), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
            //.subscribe();
    }

    publipostage() {

        var url = this.baseUrl + "Async/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
            //.subscribe();


       
    }
    mappingProgressStatus() {

        var url = this.baseUrl + "MappingProgressStatus/";

        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    progressStatus() {
        var url = this.baseUrl + "AsyncStatus/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
            //.subscribe(
            //);
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
