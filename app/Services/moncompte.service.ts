import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from '../Services/index';

@Injectable()
export class MonCompteService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    private baseUrl = "api/MonCompte/"; // web api URL

    

    getSubscription(): Observable<boolean> {
        var url = this.baseUrl + "getSubscription/";
        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);

    }

    getSubscriptionType(typeid: string): Observable<string> {
        var url = this.baseUrl + "getSubscriptionType/";
        return this.http.post(url, JSON.stringify(typeid), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);

    }

    getSenderAddresses(user: string): Observable<boolean> {
        var url = this.baseUrl + "SenderAddresses/";
        return this.http.post(url, JSON.stringify({ Useremail: user }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getSenderAddressesValid(user: string): Observable<boolean> {
        var url = this.baseUrl + "SenderAddressesValid/";
        return this.http.post(url, JSON.stringify({ Useremail: user }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getPrimarySenderAddress(user: string): Observable<boolean> {
        var url = this.baseUrl + "GetSenderPrimaryAddress/";
        return this.http.post(url, JSON.stringify({ Useremail: user }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    updateSenderAddress(address): Observable<boolean> {
        var url = this.baseUrl + "updateSenderAddress/";
        return this.http.post(url, JSON.stringify(address), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    insertSenderAddress(address, user): Observable<boolean> {
        var url = this.baseUrl + "insertSenderAddress/";
        return this.http.post(url, JSON.stringify({ address: address, user: { Useremail: user }}), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    deleteSenderAddress(addressID): Observable<boolean> {
        var url = this.baseUrl + "deleteSenderAddress/";
        return this.http.post(url, JSON.stringify(addressID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    choisirPrincipal(addressID: number, user: string): Observable<boolean> {
        var url = this.baseUrl + "choisirPrincipal/";
        return this.http.post(url, JSON.stringify({ address: { AddressID: addressID }, user: { Useremail: user } }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getPreferences(): Observable<boolean> {
        var url = this.baseUrl + "getPreferences/";
        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    updatePreferences(preferences): Observable<boolean> {
        var url = this.baseUrl + "updatePreferences/";
        return this.http.post(url, JSON.stringify(preferences), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }


    updateUserEmail(newEmail: string) {
        return this.http.post('/api/user/UpdateUserEmail', JSON.stringify(newEmail), this.getRequestOptions())
            .map(response => response)
            .catch(this.handleError);
    }

    updateUserPassword(oldPassword: string, newPassword: string) {
        return this.http.post('/api/user/UpdateUserPassword', JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword }), this.getRequestOptions())
            .map(response => response)
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