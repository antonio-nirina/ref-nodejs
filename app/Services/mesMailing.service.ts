import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, RequestMethod, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { MailingGroup } from "../Models/mailingGroup";
import { AuthenticationService } from '../Services/index';
@Injectable()
export class MesMailingService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    private baseUrl = "api/MesMailing/"; // web api URL

    // calls the [Post] /api/MesMailing/GetMailingList/ Web API method.
    getMailingGroup(username: string, currentPage, itemsPerPage, showArchived: boolean) {

        var url = this.baseUrl + "GetMailingList/";

        return this.http.post(url, JSON.stringify({ Username: username, CurrentPage: currentPage, ItemsPerPage: itemsPerPage, ShowArchived: showArchived }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }

    //calls the [Post] /api/MesMailing// Web API method.
    archiveMailingToggle(mailingGroupID: string): Observable<boolean> {

        var url = this.baseUrl + "ArchiveMailingToggle/";

        return this.http.post(url, JSON.stringify(mailingGroupID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    
    getPreviewLetters(mailingGroupID, currentPage, itemsPerPage): Observable<boolean> {

        var url = this.baseUrl + "GetPreviewLetters/";
        return this.http.post(url, JSON.stringify({ MailingGroupID: mailingGroupID, CurrentPage: currentPage, ItemsPerPage: itemsPerPage }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getBinatyLetter(letterID: number): Observable<boolean> {

        var url = this.baseUrl + "GetBinaryLetter/";

        return this.http.post(url, JSON.stringify(letterID), this.getRequestOptions())
            .map(response => {
                return response;
            })
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
        return options;
    }
}