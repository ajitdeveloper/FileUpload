import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagContentType } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }





sendtoRestApiMedthod(email:string, name:string): Observable<HttpEvent<{}>>{
  const formdata: FormData = new FormData();
  //formdata.append('email', email);
  //formdata.append('userName', userName);
  formdata.append('email', email);
  formdata.append('name', name);
  const req = new HttpRequest("POST", 'http://localhost:8080/signUp', formdata,{
    responseType:"text"
  })
  return this.http.request(req);

}


onFormSignUp(logInRequest:any):Observable<HttpEvent<{}>>{
  const formdata: FormData = new FormData();
  logInRequest = JSON.stringify(logInRequest);
  formdata.append(logInRequest, logInRequest);
  const req = new HttpRequest("POST", 'http://localhost:8080/formSignUp', formdata,{
    responseType: "text"
  })

  return this.http.request(req);
}

onLogIn(logInValue:string,credentials:any):Observable<HttpEvent<{}>>{
  const formdata: FormData = new FormData();
  let headers = new HttpHeaders();
  headers = headers.append("Authorization", "Basic " + btoa(credentials.userName + ':' + credentials.password));
  headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
  formdata.append('logInValue', logInValue);

  const req = new HttpRequest("POST", "http://localhost:8080/formLogIn", formdata,{
    responseType: "text"
  })
  return this.http.request(req);
}

}