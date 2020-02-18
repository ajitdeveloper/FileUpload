import { Injectable, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class UploadFileService {

  constructor(private http: HttpClient) { }


  /*
  * MAKING A POST REQUEST TO CALL THE BACKEND URL
  */
  uploadImages(files: FileList): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formdata.append('file', files[i]);
    }
    const req = new HttpRequest('POST', 'http://localhost:8080/imageFileUpload', formdata, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  /*
  * MAKING A POST REQUEST TO GET BACK A PROCESSED IMAGE
  */
  processImage(imgUrl: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('img', imgUrl);
    const req = new HttpRequest('POST', 'http://localhost:8080/processedImage', formdata, {
      responseType: 'json'
    });
    return this.http.request(req);
  }


  /*
  * GET ALL IMAGE WHILE CLICKING BACK 
  * BY THE HELP OF REQUEST ID
  */
  onBackClick(requestId: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('requestId', requestId);
    const req = new HttpRequest('POST', 'http://localhost:8080/back', formdata, {
      responseType: 'json'
    });
    return this.http.request(req);
  }


  /*
  * GETTING COORDINATES OF THE DETECTION ON THE IMAGES
  */
  getDetectedCoordinates(requestId: string, img: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('requestId', requestId);
    formdata.append('img', img)
    const req = new HttpRequest('POST', 'http://localhost:8080/coords', formdata, {
      responseType: 'json'
    });
    return this.http.request(req);
  }


  /*
  * METHOD FOR UNBLUR THE IMAGE
  * BY THE HELP OF COORDINATE
  */
  unBlurRegion(requestId: string, interImg: string, coords: any): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('requestId', requestId);
    formdata.append('interImg', interImg);
    formdata.append('coords', coords);
    const req = new HttpRequest('POST', 'http://localhost:8080/unBlurAll', formdata, {
      responseType: 'text'
    });
    return this.http.request(req);
  }


  /*
  * BLURRING THE SELECTED REGIONS
  * BY THE HELP OF COORDINATES
  */
  blurRegion(requestId: string, interImg: string, coords: any): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('requestId', requestId);
    formdata.append('interImg', interImg);
    formdata.append('coords', coords);
    const req = new HttpRequest('POST', 'http://localhost:8080/blurAll', formdata, {
      responseType: 'text'
    });
    return this.http.request(req);
  }


  /*
  *PASS THE USER SETTINGS TO THE BACKEND
  */
  applySettings(size: string, type: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('size', size);
    formdata.append('type', type);
    const req = new HttpRequest('POST', 'http://localhost:8080/settings', formdata, {
      responseType: 'text'
    });
    return this.http.request(req);
  }


  /*
  * GET REQUEST TO GET THE SETTINGS OF THE USER FROM THE BACKEND
  */
  getSettings(): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('GET', 'http://localhost:8080/settings', {
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
