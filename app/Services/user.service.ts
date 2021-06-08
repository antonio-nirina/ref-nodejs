import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

//import { AppConfig } from '../app.config';
import { User } from '../Models/index';

@Injectable()
export class UserService {
    constructor(private http: Http /*, private config: AppConfig*/) { }

    //getAll() {
    //    return this.http.get(this.config.apiUrl + '/users', this.jwt()).map((response: Response) => response.json());
    //}

    //getById(_id: string) {
    //    return this.http.get(this.config.apiUrl + '/users/' + _id, this.jwt()).map((response: Response) => response.json());
    //}

    create(user: User): Observable<boolean>  {
        return this.http.post('/api/user/register', user, this.jwt()).map(response => response.json())
            .catch(this.handleError);
    }

    //update(user: User): Observable<boolean>  {
    //    return this.http.post('/api/user/update', user.UserID, this.jwt()).map(response => response.json())
    //        .catch(this.handleError);
    //}

    sendemailpassword(user: User): Observable<string> {
        return this.http.post('/api/user/passwordforgot', user, this.jwt()).map(response => response.json())
            .catch(this.handleError);
    }

    checkcode(user: User): Observable<boolean> {
        return this.http.post('/api/user/checkcodepassword', user , this.jwt()).map(response => response.json())
            .catch(this.handleError);
    }


    changepassword(user: User): Observable<boolean> {
        return this.http.post('/api/user/updatepassword', user, this.jwt()).map(response => response.json())
            .catch(this.handleError);
    }
  

    private jwt() {
        // create authorization header with jwt token
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (localStorage.getItem('id_token')) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('id_token'), "MG": sessionStorage.getItem("MG")  });
            return new RequestOptions({ headers: headers });
        }
    }

    private handleError(error: Response) {
        // output errors to the console.
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }
}