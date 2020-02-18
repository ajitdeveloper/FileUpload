import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConfirmservService {

  constructor(private http:HttpClient) { }

  onConfirm(token:string):Observable<HttpEvent<{}>>{
    const formdata : FormData = new FormData();
    formdata.append('token',token);

    const req = new HttpRequest("POST", 'http://localhost:8080/confirm-account', formdata,{
      responseType : "text"
    })
    return this.http.request(req);
  }
}
