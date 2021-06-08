import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, RequestMethod, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { tokenNotExpired, JwtHelper, AuthHttp } from 'angular2-jwt';
import { HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ng2-cookies';


@Injectable()
export class AuthenticationService {
    public token: string;
    userLoggedIn: boolean = false;
    jwtHelper: JwtHelper = new JwtHelper();
    refreshSubscription: any;
    refreshTokenInProgress = new BehaviorSubject<boolean>(false); 
    checkName = 'User';
    public userFirstName: string;
    public userLastName: string;
    public useremail: string;
    public endSessionProgress = new BehaviorSubject<boolean>(false);
    stepHelp: number = 0;

    observeStepHelp = new BehaviorSubject<number>(this.stepHelp);
    isLoginSubject = new BehaviorSubject<boolean>(this.userLoggedIn);

    //isEndSessionStarted = new BehaviorSubject<boolean>(this.endSessionStarted);
  
    FirstNameLastName = new BehaviorSubject<string>("");
    Useremail = new BehaviorSubject<string>(this.useremail);

    private hasToken(): boolean {
        return !!this.token;
    }

    constructor(private http: Http, private authHttp: AuthHttp, private router: Router, private cookieService: CookieService) {
        // set token if saved in local storage
        //var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //this.token = currentUser && currentUser.token;

        this.getUser().subscribe((response) => {
            var user = JSON.parse(response._body);
            if (user != null && user.Useremail != null && user.Useremail != "") {

                this.token = user && user.token;
                this.userFirstName = user.FirstName;
                this.userLastName = user.LastName;
                this.useremail = user.Useremail;
            }
        });
        

    }



    checkCookie() {
        return this.cookieService.check(this.checkName)
    }

    login(username: string, password: string): Observable<boolean> {


        return this.http.post('/api/authenticate/get', JSON.stringify({ usermail: username, password: password,grantType:"password" }), this.getRequestOptions())
            .map((response: Response) => {
                // login successful if there's a jwt token in the response

                let token = response.json() && response.json().access_token;

                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                   // localStorage.setItem('currentUser', JSON.stringify({ Useremail: username, token: token }));
                 
                   // localStorage.setItem('token', token);
                    this.processTokenResponse(response);
                    // return true to indicate successful login
                    //this.scheduleRefresh();
                    //this.loggedIn();
                    this.userLoggedIn = true;
                    if (this.isLoginSubject.value != this.userLoggedIn) {
                        this.isLoginSubject.next(this.userLoggedIn);
                    }


                    this.getUser().subscribe((response) => {
                        var user = JSON.parse(response._body);
                        if (user != null && user.Useremail != null && user.Useremail != "") {

                          
                            this.userFirstName = user.FirstName;
                            this.userLastName = user.LastName;
                            this.useremail = user.Useremail;
                            if (this.FirstNameLastName.value != (this.userFirstName +" " + this.userLastName)) {
                                this.FirstNameLastName.next(this.userFirstName + " " + this.userLastName);
                            }

                            if (this.Useremail.value != this.useremail) {
                                this.Useremail.next(this.useremail);
                            }
                        }
                    });
                    return true;
                } else {
                    // return false to indicate failed login
                    //this.loggedIn();
                    this.userLoggedIn = false;
                    if (this.isLoginSubject.value != this.userLoggedIn) {
                        this.isLoginSubject.next(this.userLoggedIn);
                        this.FirstNameLastName.next(" ");
                        this.Useremail.next(" ");
                    }
                    return false;
                }

            });

    }


    private getNewJwt() {
        let refreshTokenId = localStorage.getItem('refresh-token-id');
        var header = new Headers();
        //let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        header.append('Content-Type', 'application/x-www-form-urlencoded');
        let body = 'grantType=refresh_token&refreshToken=' + refreshTokenId;
        return this.http.post('/api/authenticate/get', body, { headers: header })
            .map((res) => this.processTokenResponse(res));
           
    }

    public scheduleRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        let source = this.authHttp.tokenStream.map(
            token => {
                // The delay to generate in this case is the difference
                // between the expiry time and the issued at time                
                let jwtExp = this.jwtHelper.decodeToken(this.getToken()).exp;
                let iat = new Date(localStorage.getItem('.issued')).getTime() / 1000;
                let refreshTokenThreshold = 1; //seconds
                let delay = ((jwtExp - iat) - refreshTokenThreshold) * 1000;
            
                //return Observable.interval();
            });

        this.refreshSubscription = source.subscribe(() => {
            this.refreshTokenInProgress.next(true);
            this.getNewJwt().subscribe((res) => {
                var isLogged = this.serverCheckIsLogged().take(1);
                isLogged.subscribe(
                    response => {
                        if (response["IsLoggedIn"] == "true") {
                            this.userLoggedIn = true;
                            if (this.isLoginSubject.value != this.userLoggedIn) {
                                this.isLoginSubject.next(this.userLoggedIn);
                            }

                            this.getUser().subscribe((response) => {
                                var user = JSON.parse(response._body);
                                if (user != null && user.Useremail != null && user.Useremail != "") {


                                    this.userFirstName = user.FirstName;
                                    this.userLastName = user.LastName;
                                    this.useremail = user.Useremail;

                                    if (this.FirstNameLastName.value != (this.userFirstName + " " + this.userLastName)) {
                                        this.FirstNameLastName.next(this.userFirstName + " " + this.userLastName);
                                    }

                                    if (this.Useremail.value != this.useremail) {
                                        this.Useremail.next(this.useremail);
                                    }
                                }
                            });
                            return this.userLoggedIn;
                        }
                        else {
                            this.token = null;
                            localStorage.clear();
                 
                            this.endSession();
                            this.userLoggedIn = false;
                            if (this.isLoginSubject.value != this.userLoggedIn) {
                                this.isLoginSubject.next(this.userLoggedIn);
                            }
                            this.FirstNameLastName.next("");
                            this.Useremail.next("");
                            return this.userLoggedIn;

                        }
                    });
                this.refreshTokenInProgress.next(false);
            }, (error) => {
               
                var isLogged = this.serverCheckIsLogged().take(1);
                isLogged.subscribe(
                    response => {
                        if (response["IsLoggedIn"] == "true") {
                            this.userLoggedIn = true;
                            if (this.isLoginSubject.value != this.userLoggedIn) {
                                this.isLoginSubject.next(this.userLoggedIn);
                            }


                            this.getUser().subscribe((response) => {
                                var user = JSON.parse(response._body);
                                if (user != null && user.Useremail != null && user.Useremail != "") {


                                    this.userFirstName = user.FirstName;
                                    this.userLastName = user.LastName;
                                    this.useremail = user.Useremail; 

                                    if (this.FirstNameLastName.value != (this.userFirstName + " " + this.userLastName)) {
                                        this.FirstNameLastName.next(this.userFirstName + " " + this.userLastName);
                                    }

                                    if (this.Useremail.value != this.useremail) {
                                        this.Useremail.next(this.useremail);
                                    }
                                }
                            });
                            return this.userLoggedIn;
                        }
                        else {
                            this.token = null;
                            localStorage.clear();
                            this.userLoggedIn = false;
                            if (this.isLoginSubject.value != this.userLoggedIn) {
                                this.isLoginSubject.next(this.userLoggedIn);
                            }

                            this.FirstNameLastName.next("");
                            this.Useremail.next("");
                            this.endSession();
                           
                            
                            return this.userLoggedIn;

                        }
                    });
                this.refreshTokenInProgress.next(false);
            })
        });


       
    }

    public getToken(): string {
        return localStorage.getItem('id_token');
    }
  

    public unscheduleRefresh() {
        // Unsubscribe fromt the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    public persistTokenInformation(token: string, notBefore: string, expires: string, refreshTokenId: string) {
        //localStorage.setItem('currentUser', JSON.stringify({ Useremail: username, token: token }));
        this.token = token;
        localStorage.setItem('id_token', token);
        localStorage.setItem('.issued', notBefore);
        localStorage.setItem('.expires', expires);
        localStorage.setItem('refresh-token-id', refreshTokenId);
    }


    public processTokenFromSP_GP(res: Response) {
        this.persistTokenInformation(res["access_token"], res["notBefore"], res["expires"], res["refresh_token"]);
        return Observable.of(true);
    }

    private processTokenResponse(res: Response) {
        this.persistTokenInformation(res.json().access_token, res.json().notBefore, res.json().expires, res.json().refresh_token);
        return Observable.of(true);
    }

    endSession() {
        
        return this.http.get('/api/authenticate/EndSession', this.getRequestOptions())
            .map(response => response)
            .catch(this.handleError);
    }

    getUser() {
        return this.http.post('/api/authenticate/GetCurrentUserEmail',null, this.getRequestOptions())
            .map(response => response)
            .catch(this.handleError);
    }

   

    logout(): void {
        // clear token remove user from local storage to log user out
        if (this.token != null) {
            this.token = null;
            localStorage.clear();
            this.FirstNameLastName.next("");
            this.Useremail.next("");
            this.endSession()
                .subscribe((response) => { this.loggedIn(); },
                error => {
                });
            if (window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'home' && window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'previsualiser' && window.location.href.substr(window.location.href.lastIndexOf('/') + 1) != 'confirmation') {
               
                this.router.navigate(['home']);
            }

        }
     
      
    }

    serverCheckIsLogged() {
        return this.http.get('/api/authenticate/IsLoggedIn', this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    loggedIn() {
        if (this.endSessionProgress.value != true) {
            if (this.checkCookie) {

                var token2 = this.getToken();
                if (token2 != null) {
                    this.token = token2;
                    if (this.jwtHelper.isTokenExpired(token2)) {
                        if (this.refreshTokenInProgress.value == false) {
                            return this.scheduleRefresh();


                        }

                    }
                    else {
                        this.token = this.getToken();
                        this.userLoggedIn = true;

                        if (this.isLoginSubject.value != this.userLoggedIn) {
                            this.isLoginSubject.next(this.userLoggedIn);
                        }



                        if (this.FirstNameLastName.value == null || this.FirstNameLastName.value == '' || this.Useremail.value == null || this.Useremail.value == "") {
                            this.getUser().subscribe((response) => {
                                var user = JSON.parse(response._body);
                                if (user != null && user.Useremail != null && user.Useremail != "") {


                                    this.userFirstName = user.FirstName;
                                    this.userLastName = user.LastName;
                                    this.useremail = user.Useremail;

                                    if (this.FirstNameLastName.value != (this.userFirstName + " " + this.userLastName)) {
                                        this.FirstNameLastName.next(this.userFirstName + " " + this.userLastName);
                                    }


                                    if (this.Useremail.value != this.useremail) {
                                        this.Useremail.next(this.useremail);
                                    }
                                }
                            });
                        }
                    }


                }
                else {
                    var isLogged = this.serverCheckIsLogged();
                    isLogged.subscribe(
                        response => {
                            if (response["IsLoggedIn"] == "true") {
                                this.processTokenFromSP_GP(response);
                                this.userLoggedIn = true;

                                if (this.isLoginSubject.value != this.userLoggedIn) {
                                    this.isLoginSubject.next(this.userLoggedIn);
                                }

                                if (this.refreshTokenInProgress.value == false) {
                                    return this.scheduleRefresh();


                                }

                                this.getUser().subscribe((response) => {
                                    var user = JSON.parse(response._body);
                                    if (user != null && user.Useremail != null && user.Useremail != "") {


                                        this.userFirstName = user.FirstName;
                                        this.userLastName = user.LastName;
                                        this.useremail = user.Useremail;

                                        if (this.FirstNameLastName.value != (this.userFirstName + " " + this.userLastName)) {
                                            this.FirstNameLastName.next(this.userFirstName + " " + this.userLastName);
                                        }

                                        if (this.Useremail.value != this.useremail) {
                                            this.Useremail.next(this.useremail);
                                        }
                                    }
                                });

                            }
                            else {
                                this.token = null;
                                localStorage.clear();
                                this.userLoggedIn = false;

                                if (this.isLoginSubject.value != this.userLoggedIn) {
                                    this.isLoginSubject.next(this.userLoggedIn);
                                }
                                this.FirstNameLastName.next("");
                                this.Useremail.next("");
                                this.endSession();




                            }
                        });
                }



            }
            else {
                this.token = null;
                localStorage.clear();

                this.endSession();
                this.userLoggedIn = false;
            }

            if (this.isLoginSubject.value != this.userLoggedIn) {
                this.isLoginSubject.next(this.userLoggedIn);
            }
        }
        else {
           
          
            this.userLoggedIn = false;
            if (this.isLoginSubject.value != this.userLoggedIn) {
                this.isLoginSubject.next(this.userLoggedIn);
            }

        }

    }

    isLoggedIn(): Observable<boolean> {
        return this.isLoginSubject.asObservable();
    }


    firstNameLastName(): Observable<string> {
        return this.FirstNameLastName.asObservable();
    }

    returnEmail(): Observable<string> {
        return this.Useremail.asObservable();
    }

    private handleError(error: Response) {
  
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }

   

    private getRequestOptions() {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.token, "Content-Type": "application/json", "MG": sessionStorage.getItem("MG")  });
        let options = new RequestOptions({ headers: headers });
       
        return options;
    }



}