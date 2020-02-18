import { Injectable } from '@angular/core';
import Konva from 'konva';
@Injectable({
providedIn: 'root'
})

export class ShapeService {

  public rectangles: Konva.Rect[];
  constructor() { 
  
  }
  
  rectangle() {
    return new Konva.Rect({
      name : 'rectangle',
      x: 20,
      y: 20,
      width: 50,
      height: 50,
      fill: '',
      stroke: 'pink',
      strokeWidth: 4,
      draggable: true,
      id: 'myRect'
    });
  }

  rect(x:number, y:number, width:number, height:number,stroke?: string){
    return new Konva.Rect({
      name: 'rectangle',
      x: x,
      y : y,
      width : width,
      height: height,
      fill:'',
      stroke: 'red',
      strokeWidth:4,
      draggable: true,
      id: 'newRect'
    })
  }
}