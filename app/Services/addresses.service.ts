import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Address } from "../Models/address";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from '../Services/index';

@Injectable()
export class AddressService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }
    private baseUrl = "api/Address/"; // web api URL
    // calls the [POST] /api/addresses/GetAllAddresses/ Web API method to retrieve all addresses.
    getAllAddresses(user, currentPage: number, itemsPerPage: number, groupID: number, showArchived: boolean, keyword: string): Observable<boolean> {

        var url = this.baseUrl + "GetDestinationAddresses/";
        return this.http.post(url, JSON.stringify({ currentUser: user, CurrentPage: currentPage, ItemsPerPage: itemsPerPage, GroupID: groupID, ShowArchived: showArchived, Keyword: keyword}), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    // calls the [POST] /api/addresses/GetAddressGroups/ Web API method to retrieve all address groups.
    getAddressGroups(user): Observable<boolean> {

        var url = this.baseUrl + "GetAddressGroups/";
        return this.http.post(url, JSON.stringify({ Useremail: user }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    // calls the [POST] /api/addresses/GetAddressGroups/ Web API method to retrieve all address groups.
    getAddressesFromGroup(groupID): Observable<boolean> {

        var url = this.baseUrl + "GetAddressesFromGroup/";
        return this.http.post(url, JSON.stringify(groupID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    getGroupsForAddress(addressID): Observable<boolean> {

        var url = this.baseUrl + "GetGroupsForAddress/";
        return this.http.post(url, JSON.stringify(addressID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    GetTotalAddressesFromSelectedGroups(adrGroupsIDs): Observable<boolean> {
        var url = this.baseUrl + "GetTotalAddressesFromSelectedGroups/";
        return this.http.post(url, JSON.stringify(adrGroupsIDs), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    changeGroupName(group): Observable<boolean> {
        var url = this.baseUrl + "ChangeGroupName/";
        return this.http.post(url, JSON.stringify(group), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    insertAddressGroup(groupName, user): Observable<boolean> {
        var url = this.baseUrl + "InsertAddressGroup/";
        return this.http.post(url, JSON.stringify({ group: { GroupName: groupName }, user: { Useremail: user } }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    insertAddressToAddressGroup(addressID, addressGroupID): Observable<boolean> {
        var url = this.baseUrl + "InsertAddressToAddressGroup/";
        return this.http.post(url, JSON.stringify({ address: { AddressID: addressID }, addressGroup: { AddressGroupID: addressGroupID } }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    removeAddressFromAddressGroup(addressID, addressGroupID): Observable<boolean> {
        var url = this.baseUrl + "RemoveAddressFromAddressGroup/";
        return this.http.post(url, JSON.stringify({ address: { AddressID: addressID }, addressGroup: { AddressGroupID: addressGroupID } }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    deleteAddressGroup(group): Observable<boolean> {
        var url = this.baseUrl + "DeleteAddressGroup/";
        return this.http.post(url, JSON.stringify(group), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    updateDestinationAddress(address): Observable<boolean> {
        var url = this.baseUrl + "updateDestinationAddress/";
        return this.http.post(url, JSON.stringify(address), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    insertDestinationAddress(address, user): Observable<number> {
        var url = this.baseUrl + "insertDestinationAddress/";
        return this.http.post(url, JSON.stringify({ address: address, user: { Useremail: user } }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    insertExpediteurAddress(address, user): Observable<number> {
        var url = this.baseUrl + "insertExpediteurAddress/";
        return this.http.post(url, JSON.stringify({ address: address, user: { Useremail: user } }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    archiveDestinationAddressToggle(addressID): Observable<boolean> {
        var url = this.baseUrl + "archiveDestinationAddressToggle/";
        return this.http.post(url, JSON.stringify(addressID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getAccessRightByUserID(user): Observable<number> {
        var url = this.baseUrl + "getAccessRightByUserID/";
        return this.http.post(url, JSON.stringify({ Useremail: user }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    importAddresses(accessRightID, selectedGroups) {
        var url = this.baseUrl + "importAddresses/";

        return this.http.post(url, JSON.stringify(({ accessRightID: accessRightID, selectedGroups: selectedGroups })), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    insertAddressForMailingGroup(address): Observable<number> {
        var url = this.baseUrl + "InsertAddressForMailingGroup/";
        return this.http.post(url, JSON.stringify(address), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    updateAddressForMailingGroup(address): Observable<number> {
        var url = this.baseUrl + "UpdateAddressForMailingGroup/";
        return this.http.post(url, JSON.stringify(address), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getSenderFromAddressID(addressID): Observable<boolean> {
        var url = this.baseUrl + "GetSenderFromAddressID/";

        return this.http.post(url, JSON.stringify(addressID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getSender(): Observable<boolean> {
        var url = this.baseUrl + "GetSender/";

        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    addSenderToUser(): Observable<boolean> {
        var url = this.baseUrl + "AddSenderToUser/";

        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    copySender(): Observable<boolean> {
        var url = this.baseUrl + "CopySender/";

        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getExpediteurs(user, currentPage: number, itemsPerPage: number, showArchived: boolean, keyword: string): Observable<boolean> {

        var url = this.baseUrl + "GetExpediteurAddresses/";
        return this.http.post(url, JSON.stringify({ currentUser: user, CurrentPage: currentPage, ItemsPerPage: itemsPerPage, ShowArchived: showArchived, Keyword: keyword}), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    //// calls the [GET] /api/items/GetMostViewed/{n} Web API method to retrieve the most viewed items.
    //getMostViewed(num?: number) {
    //    var url = this.baseUrl + "GetMostViewed/";
    //    if (num != null) { url += num; }
    //    return this.http.get(url)
    //        .map(response => response.json())
    //        .catch(this.handleError);
    //}
    //// calls the [PUT] /api/addresses/Get/ Web API method to retrieve all addresses.
    //updateAddress(address: Address) {
    //    var url = this.baseUrl + "Put/";
    //    return this.http.put(url, JSON.stringify(address), this.getRequestOptions())
    //        .map(response => response.json())
    //        .catch(this.handleError);
    //}

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
