import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DocumentVariable } from "../Models/documentVariable";
import { HeaderMapper } from "../Models/HeaderMapper";
import { MailingGroup } from "../Models/mailingGroup";
import { TarifCalculer } from "../Models/tarifCalculer";
import { EmailContact } from "../Models/emailcontact";
import { Country } from "../Models/country";

import { AuthenticationService } from '../Services/index';

@Injectable()
export class PreparationService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }
    private baseUrl = "api/Preparation/"; // web api URL
    // calls the [GET] /api/Preparation/Get/ Web API method.

    isModelCreated(): Observable<boolean> {
        var url = this.baseUrl + "IsModelCreated/";
        return this.http.get(url, this.getRequestOptions()) 
            .map(response => response.json())
            .catch(this.handleError); 

    }

    getAllLetterTypes(): Observable<boolean> {
        var url = this.baseUrl + "LetterTypes/";
        return this.http.get(url, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getAllCivilites(): Observable<boolean> {
        var url = this.baseUrl + "Civilites/";
        return this.http.get(url, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getAllCountries(): Observable<boolean> {
        var url = this.baseUrl + "Countries/";
        return this.http.get(url, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    } 

    getDocumentVariables(): Observable<boolean> {
        var url = this.baseUrl + "Variables/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    updateDocumentVariables(docuemntVariables): Observable<boolean> {
        var url = this.baseUrl + "UpdateVariable/";
        return this.http.post(url, JSON.stringify(docuemntVariables), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getCustomHeaders(): Observable<boolean> {
        var url = this.baseUrl + "CustomVariables/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getFirstLine(): Observable<boolean> {
        var url = this.baseUrl + "FirstLine/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    removeTemplate(): Observable<string> {
        var url = this.baseUrl + "RemoveTemplate/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }


    removeAllAnnexes(): Observable<string> {
        var url = this.baseUrl + "RemoveAllAnnexes/";
        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    setAddressesImportedStatus(): Observable<string> {
        var url = this.baseUrl + "SetAddressesImportedStatus/";
        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    setInitializeStatus(): Observable<string> {
        var url = this.baseUrl + "SetInitializeStatus/";
        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    removeDoc(documentID): Observable<string> {
        var url = this.baseUrl + "RemoveDoc/";
        return this.http.post(url, JSON.stringify(documentID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getCitiesFromZip(zipCode): Observable<boolean> {
        var url = this.baseUrl + "CitiesFromZip/";
        return this.http.post(url, JSON.stringify(zipCode), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }


    sendContactEmail(model: EmailContact): Observable<boolean> {
        var url = this.baseUrl + "ContactEmail/";
        return this.http.post(url, JSON.stringify(model), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getCalculatorPricesAllLetterTypes(model: TarifCalculer): Observable<boolean> {

        var url = this.baseUrl + "GetCalculatorPricesAllLetterTypes/";

        return this.http.post(url, JSON.stringify(model), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getDateLaPosteOnlyPost(model: TarifCalculer) {

        var url = this.baseUrl + "DateForSendingOnlyPost/";

        return this.http.post(url, JSON.stringify(model), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
        //.subscribe();
    }

    getCalculatorFacture(model: TarifCalculer): Observable<boolean> {
        var url = this.baseUrl + "GetCalculatorFacture/";
        return this.http.post(url, JSON.stringify(model), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getFacture(orderID: number): Observable<boolean> {
        var url = this.baseUrl + "GetFacture/";
        return this.http.post(url, JSON.stringify(orderID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }
    
    getMainDoc(orderID: number): Observable<boolean> {
        var url = this.baseUrl + "GetMainDoc/";
        return this.http.post(url, JSON.stringify(orderID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getCSV(orderID: number): Observable<boolean> {
        var url = this.baseUrl + "GetCSV/";
        return this.http.post(url, JSON.stringify(orderID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }


    getAnnex(orderID: number): Observable<boolean> {
        var url = this.baseUrl + "GetAnnex/";
        return this.http.post(url, JSON.stringify(orderID), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }


    //getFacture(orderID: number): Observable<boolean> {
    //    var url = this.baseUrl + "GetFacture/";
    //    return this.http.post(url, JSON.stringify(orderID), this.getRequestOptions())
    //        .map(response => response.json())
    //        .catch(this.handleError);
    //}

    getMonthlyFacture(factureDate: Date): Observable<boolean> {
        var url = this.baseUrl + "GetMonthlyFacture/";
        return this.http.post(url, JSON.stringify({ date: factureDate }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getFactureMonths(year: number): Observable<boolean> {
        var url = this.baseUrl + "GetFactureMonths/";
        return this.http.post(url, JSON.stringify(year), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getDocuments(): Observable<boolean> {
        var url = this.baseUrl + "Documents";
        return this.http.post(url, null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    sendEmailDevis(model: TarifCalculer): Observable<boolean> {
        var url = this.baseUrl + "SendEmailDevis/";
        return this.http.post(url, JSON.stringify(model), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getAllMandatoryHeaders(): Observable<boolean> {
        var url = this.baseUrl + "MandatoryHeaders/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    autoMappHeaders() {
        var url = "api/File/AutoMappHeaders/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    checkMapping(destinationCountrySelected: Country) {
        var url = "api/File/CheckMapping/";
        return this.http.post(url, JSON.stringify({ Country: destinationCountrySelected }), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    insertHeaderMapper(mapper: HeaderMapper, documentVariable: DocumentVariable): Observable<boolean> {
        var url = this.baseUrl + "SetHeaderMapper/";
        let requestObject: MapperRequest = new MapperRequest(mapper, documentVariable);
        return this.http.post(url, JSON.stringify(requestObject), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getMappedHeaders(): Observable<boolean> {
        var url = this.baseUrl + "GetMappedHeaders/";
        return this.http.post(url,null, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getArrangedFile(): Observable<boolean> {
        var url = this.baseUrl + "GetArrangedFile/";
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

export class MapperRequest {
    Mapper: HeaderMapper;
    DocumentVariable: DocumentVariable;

    constructor(mapper: HeaderMapper, documentVariable: DocumentVariable) {
        this.Mapper = mapper;
        this.DocumentVariable = documentVariable;
    }
}