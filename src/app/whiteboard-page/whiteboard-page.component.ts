import { Component, OnInit, Input, HostListener, SystemJsNgModuleLoader } from '@angular/core';
import Konva from 'konva';
import { ShapeService } from '../shape.service';
import { FormUploadComponent } from '../form-upload/form-upload.component';
import { UploadFileService } from '../upload-file.service';
import { HttpResponse, JsonpClientBackend } from '@angular/common/http';
import { ImageDataService } from '../image-data.service';
import { Rect } from 'konva/types/shapes/Rect';



@Component({
  selector: 'app-whiteboard-page',
  templateUrl: './whiteboard-page.component.html',
  styleUrls: ['./whiteboard-page.component.css']
})
export class WhiteboardPageComponent implements OnInit {
  @Input() img: FormUploadComponent;

  //VARIABLES USED

  shapes: any = [];
  myShapes: any = [];
  urlFromOtherImage: any;
  imageSrc: any;
  stage: Konva.Stage;
  layer: Konva.Layer;
  positionX: any;
  positionY: any;
  width: any;
  height: any;
  coordinates: any = [];
  subscription: any;
  imageUrlFromOther: any;
  previousRoute: string;
  requestId: string;
  allX: any = [];
  allW: any = [];
  allY: any = [];
  allH: any = [];
  eachCoordinates: any = [];
  selectedShape: any = [];
  transformers: Konva.Transformer[] = [];


  constructor(
    private shapeService: ShapeService,
    private uploadService: UploadFileService,
    private imageDataService: ImageDataService,

  ) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {

    // ON PAGE INITIALIZATION

    this.requestId = sessionStorage.getItem('requestId');

    //CREATING THE STAGE

    let width = window.innerWidth * 0.9;
    let height = window.innerHeight;
    this.stage = new Konva.Stage({
      x:200,
      y:200,
      container: 'container',
      width: width,
      height: height,
    });


    //GETTING THAT IMAGE TO BE PROCESSED WHEN EDIT BUTTON WAS PRESSED ON THE PARTICULAR IMAGE

    this.subscription = this.imageDataService.getImageUrl().subscribe(imageUrl => this.imageUrlFromOther = imageUrl);
    this.urlFromOtherImage = this.imageUrlFromOther;
 
    // GETTING THE DETECTED COORDINATES

    this.uploadService.getDetectedCoordinates(this.requestId, this.imageUrlFromOther).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        for (let coord of event.body) {
          this.allX.push(coord.x);
          this.allW.push(coord.width);
          this.allY.push(coord.y);
          this.allH.push(coord.height);
        }
      }
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    //TO MAKE THE STAGE ID STATIC
    this.stage._id = 1;

    /*
    * ON CLICK ON THE STAGE 
    */
    this.stage.on('click', event => {
      let check: boolean;
      let double = true;
      check = true;
      for (let i = 0; i < this.allX.length; i++) {

        /*
        * GETTING THE MOUSE X, Y POINTS WHEN CLICKED 
        * AND ALSO BEING CHECK THAT WHETHER IT LIES ON THE DETECTED REGION OR NOT
        */
        if (event.evt.x >= this.allX[i] && event.evt.x <= this.allX[i] + this.allW[i] && event.evt.y >= this.allY[i] && event.evt.y <= this.allY[i] + this.allH[i]) {
          check = false;

          //CONFIRMING IF THERE IS NO OTHER OBJECT EXCEPT STAGE IF TRUE THAN CREATES A RECTANGLE 
          if (event.target._id == 1) {
            this.addRect(this.allX[i], this.allY[i], this.allW[i], this.allH[i]);
          }
        }
      }


      /*
      * IF THERE IS DOUBLE CLICK ON THE STAGE 
      * DELETES ALL THE SELECTED SHAPES FROM THE SELECTED SHAPE ARRAY
      * AND ALL THE SHAPE OBJECT AS RED
      */
      this.stage.on('dblclick', event => {
        for (let rect of this.selectedShape) {
          rect.stroke('red');
        }
        this.eachCoordinates = [];
        this.selectedShape = [];
        double = false;
      })

      // OR CHECKS IF IT IS STAGE AND DOUBLE CLICK IS DONE, CREATES A NEW RECTANGLE OBJECT
      if (event.target._id === 1 && check && double) {
        this.addRect(event.evt.x, event.evt.y, 30, 30);
      }
    }
    )

    var ctlKey: boolean;
    //LISTENS FOR A CONTROL KEY IS PRESSED OR NOT
    window.addEventListener('keydown', function (e) {
      if (e.ctrlKey) {
        ctlKey = true;
        console.log(ctlKey);
      }
    })

    //LISTENS FOR A CONTROL KEY IS REMOVED
    window.addEventListener('keyup', function (e) {
      if (!e.ctrlKey) {
        ctlKey = false;
        console.log(ctlKey);
      }
    })

    // LISTENS FOR A DELETE KEY IS PRESSED, AND CALLED A DELETE LISTENER
    window.addEventListener('keydown', event => {
      if (event.keyCode === 46) {
        console.log('delete');
        this.deleteListener(this.selectedShape);
      }
    })

    // CLICK ON THE STAGE
    this.stage.on('click', event => {

      // IF CONTROL KEY IS PRESSED
      if (ctlKey) {

        // IF IT IS NOT SHAPE
        if (!this.stage.clickStartShape) {
          this.selectedShape = [];
          this.eachCoordinates = [];
          return;
        }

        // AND CLICK ON THE RECTANGLE OBJECT, THEN ADD THE YELLOW STROKE TO IDENTIFY IT IS SELECTED, AND PUSH IT TO THE ARRAY OF SELECTED SHAPES
        if (event.target._id == this.stage.clickStartShape._id) {
          this.stage.clickStartShape._setAttr('stroke', 'yellow');
          this.selectedShape.push(event.target);
          this.layer.draw();
        }

        // PASS THE ARRAY TO THE METHOD
        this.passedRect(this.selectedShape);
      }

      // IF CONTROL KEY IS NOT PRESSED
      if (!ctlKey) {
        console.log('control is removed');

        //AND THE CLICKED REGION IS NOT A RECTANGLE REGION THEN EMPTY ALL THE SELECTED SHAPES AND ARRAY OF COORDINATES
        if (!this.stage.clickStartShape) {
          this.selectedShape = [];
          this.eachCoordinates = [];
          return;
        }

        // OR ELSE IF THE CLICKED REGION IS A RECTANGLE OBJECT 
        if (event.target._id == this.stage.clickStartShape._id) {
          //ASSIGN ALL OTHER RECTANGLE STROKE TO THE RED
          for (let rect of this.selectedShape) {
            if (rect._id != event.target._id) {
              rect.stroke('red');
            }
          }

          // ASSIGN YELLOW STROKE, AND MARK THIS RECTANGLE AS SELECTED AND REMOVE ALL OTHER SHAPES AND COORDINATES FROM THE ARRAY
          this.stage.clickStartShape.stroke('yellow');
          this.selectedShape = [];
          this.eachCoordinates = [];
          this.selectedShape.push(event.target);
          this.layer.draw();
        }
        this.passedRect(this.selectedShape);
      }
    })
    this.stage.on('dblclick', event => {
    })
  }



  /*
  * THIS IS A DELETE LISTENER
  * WHICH DELETES THE PASSED RECT AS AN ARGUMENT FROM THE STAGE
  */
  deleteListener(rect: Rect[]) {
    const component = this;
    let rec: Rect;
    console.log('called delete');
    for (rec of rect) {
      console.log((component.shapes));
      rec.destroy();
      if (this.selectedShape._id == component.shapes._id) {
      }
    }
    this.layer.draw();
  }


  /*
  * THIS METHOD GETS THE COORDINATES OF SELECTED RECTANGLES
  * AND THOSE RECTANGLES ARE PASSED AS AN ARGUMENT IN THIS METHOD
  */
  passedRect(rect: Rect[]) {
    console.log(rect);
    for (let rec of rect) {
      console.log(rec);
      console.log(rec.position().x | 0);
      this.eachCoordinates.push(rec.position().x | 0);
      this.eachCoordinates.push(rec.position().y | 0);
      console.log((rec.width() * rec.scaleX()) | 0);
      this.eachCoordinates.push((rec.width() * rec.scaleX()) | 0);
      this.eachCoordinates.push((rec.height() * rec.scaleY()) | 0);
    }
  }


  /*
  * METHOD TO ADD RECTANGLE OBJECT
  */
  addRect(x, y, width, height) {
    const rect = this.shapeService.rect(x, y, width, height);
    this.shapes.push(rect);
    this.layer.add(rect);
    this.stage.add(this.layer);
    this.layer.draw();
    this.addNewTransformerListeners(rect);
  }


  /*
  * ITS A METHOD TO ADD A TRANSFORMER TO THE RECTANGLE OBJECT
  */
  addNewTransformerListeners(rect) {
    const component = this;
    const tr = new Konva.Transformer();

    //DOUBLE CLICK ON STAGE
    this.stage.on('dblclick', event => {
      console.log(event.target._id);

      //IF THE OBJECT ON STAGE IS NOT A SHAPE JUST RETURN
      if (!this.stage.clickStartShape) {
        return;
      }

      //IF THE OBJECT IS RECTANGLE ON THE STAGE
      if (event.target._id == this.stage.clickStartShape._id) {

        // WE WILL EMPTY OUR ARRAY OF COORDINATES
        this.coordinates = [];
        console.log("Its new transformer");

        // ADD A TRANSFORMER AROUND IT'S SHAPE
        component.layer.add(tr);
        console.log(event.target);

        // IT SIMPLY ATTATCHED A TRANSFORMER TO THE TARGETED OBJECT
        tr.attachTo(event.target);

        // PUSHES IT TO OUR ARRAY OF TRANSFORMERS
        component.transformers.push(tr);

        // DRAWS ON THE VIEW
        component.layer.draw();
        console.log(rect.position().x);
        this.coordinates.push(rect.position().x);
        this.coordinates.push(rect.position().y);

        if (rect.scaleX > 1) {
          var w = 100 * rect.scaleX();
          var h = 50 * rect.scaleY();
          this.coordinates.push(w);
          this.coordinates.push(h);
          console.log(this.coordinates);
        }
      }

      else {
        tr.detach();
        component.layer.draw();
      }

      // IF THE CLICK IS ON THE STAGE THEN DETATCH THE TRANSFORMER (TR) FROM THE OBJECT
      this.stage.on('click', event => {
        tr.detach();
        component.layer.draw();
      })

      //ALSO IF THERE IS ONLY ONE CLICK ON THE STAGE AND IT IS NOT THE ID OF THE STAGE(ITS OBJECT) THEN REMOVE THE TRANSFORMER FROM OTHER OBJECT
      this.stage.on('click', event => {
        if (event.currentTarget._id != 1) {
          tr.detach();
          component.layer.draw();
        }
      })
    })
  }


  /*
  * UNBLURRING THE SELECTED RECTANGULAR REGION REGION
  */
  unBlurAll(e) {
    this.uploadService.unBlurRegion(this.requestId, this.urlFromOtherImage, this.eachCoordinates).subscribe((event: any) => {
      console.log("OK");
      if (event instanceof HttpResponse) {
        this.urlFromOtherImage = event.body;
      }
    })
  }


  /*
  * BLURRING THE SELECTED RECTANGULAR REGION
  */
  blurAll(e) {
    console.log(e);
    console.log(this.eachCoordinates);
    this.uploadService.blurRegion(this.requestId, this.urlFromOtherImage, this.eachCoordinates).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.urlFromOtherImage = event.body;
      }
    })
  }
}
