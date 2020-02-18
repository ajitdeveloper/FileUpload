import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
private imageUrl = new BehaviorSubject("default message");




getImageUrl(): Observable<String>{
  return this.imageUrl.asObservable();
}


 updateMessage(image : string){
   this.imageUrl.next(image);
 }
  constructor() { }


}