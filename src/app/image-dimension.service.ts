import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageDimensionService {

  constructor(private http:HttpClient) { }


  getDimension(imageUrl:string):Observable<HttpEvent<{}>>{
    const formdata : FormData = new FormData();
    formdata.append('imageUrl', imageUrl);
    const req = new HttpRequest("POST", 'http://localhost:8080/imageDimension', formdata,{
      responseType : "json"
    })
    return this.http.request(req);
  }
}
