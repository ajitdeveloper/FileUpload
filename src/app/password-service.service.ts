import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordServiceService {

  constructor(private http:HttpClient) { }

  onForget(email:string):Observable<HttpEvent<{}>>{
    const formdata : FormData = new FormData();
    formdata.append('email',email);

    const req = new HttpRequest("POST", 'http://localhost:8080/sendResetLink', formdata,{
      responseType : "text"
    })
    return this.http.request(req);
  }


  onReset(token:string,password:string):Observable<HttpEvent<{}>>{
    const formdata : FormData = new FormData();
    formdata.append('token', token);
    formdata.append('password',password);

    const req = new HttpRequest("POST", 'http://localhost:8080/resetPassword', formdata,{
      responseType : "text"
    })
    return this.http.request(req);
  }
}
