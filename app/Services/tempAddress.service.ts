import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, RequestMethod, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from '../Services/index';

@Injectable()
export class TempAddressService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    private baseUrl = "api/Preparation/"; // web api URL
    private baseUrlForAddressGroups = "api/address/";

    // calls the [Post] /api/File/Incorrect/ Web API method.
    getIncorrectAddress() {
        
        var url = this.baseUrl + "Incorrect/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    // calls the [Post] /api/File/Incorrect/ Web API method.
    getIncorrectAddressForAddressGroups(user): Observable<boolean> {

        var url = this.baseUrlForAddressGroups + "IncorrectForAddressGroups/";
        return this.http.post(url, JSON.stringify(user), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    // calls the [Post] /api/File/Delete/ Web API method.
    deleteTempAddresses(): Observable<boolean> {
        var url = this.baseUrl + "RemoveCSV/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json()).share()
            .catch(this.handleError);
            //.subscribe();
    }

    // calls the [Post] /api/File/Delete/ Web API method.
    deleteTempAddressesForAddressGroups(accessRightID): Observable<boolean> {
        var url = this.baseUrlForAddressGroups + "RemoveCSVForAddressGroups/";

        return this.http.post(url, JSON.stringify(accessRightID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }

    // calls the [Post] /api/File/Delete/ Web API method.
    deleteTempAddress(addressID): Observable<boolean> {
        var url = this.baseUrl + "DeleteAddress/";

        return this.http.post(url, JSON.stringify({ addressID: addressID }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
            //.subscribe();
    }

    // calls the [Post] /api/File/Delete/ Web API method.
    deleteTempAddressForAddressGroups(tempAddressID): Observable<boolean> {
        var url = this.baseUrlForAddressGroups + "DeleteTempAddressForAddressGroups/";

        return this.http.post(url, JSON.stringify(tempAddressID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }

    GetTempAddresses(): Observable<boolean> {
        var url = this.baseUrl + "GetTempAddresses/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    GetNumberOfCorrectAddresses(): Observable<boolean> {
        var url = this.baseUrl + "GetNumberOfCorrectAddresses/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    // calls the [Post] /api/File/AddressPreview/ Web API method.
    getAddressPreview(): Observable<boolean> {
        var url = this.baseUrl + "AddressPreview/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    // calls the [Post] /api/File/AddressPreview/ Web API method.
    getAddressPreviewForAddressGroups(accessRightID): Observable<boolean> {
        var url = this.baseUrlForAddressGroups + "AddressPreviewForAddressGroups/";

        return this.http.post(url, JSON.stringify(accessRightID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    updateAddresses(addresses): Observable<boolean> {
        var url = this.baseUrl + "UpdateTempAddress/";

        return this.http.post(url, JSON.stringify(addresses), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    updateAddressesForAddressGroups(addresses): Observable<boolean> {
        var url = this.baseUrlForAddressGroups + "UpdateTempAddressForAddressGroups/";

        return this.http.post(url, JSON.stringify(addresses), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    UpdateTempAddressesAddSender(senderAddressID): Observable<boolean> {
        var url = this.baseUrl + "UpdateTempAddressesAddSender/";

        return this.http.post(url, JSON.stringify({ senderAddressID: senderAddressID }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    CreateAndGetTempAddressesFromGroups(adrIDs, senderAddressID): Observable<boolean> {
        var url = this.baseUrl + "CreateAndGetTempAddressesFromGroups/";

        return this.http.post(url, JSON.stringify({ adrIDs: adrIDs, senderAddressID: senderAddressID }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    InsertProgresProcess(): Observable<boolean> {
        var url = this.baseUrlForAddressGroups + "InsertProgresProcess/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    // calls the [Post] /api/File/Incorrect/ Web API method.
    insertAdditionalCSVHeadersFromVariables(): Observable<boolean> {

        var url = this.baseUrlForAddressGroups + "InsertAdditionalCSVHeadersFromVariables/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    insertValuesForAdditionalCSVHeadersFromVariables(headers): Observable<boolean> {
        var url = this.baseUrlForAddressGroups + "InsertValuesForAdditionalCSVHeadersFromVariables/";
        var strigified = JSON.stringify(headers);
        return this.http.post(url, JSON.stringify(headers), this.getRequestOptions())
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