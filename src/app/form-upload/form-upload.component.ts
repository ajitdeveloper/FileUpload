import { Component, OnInit, Input, Injectable, HostListener, SystemJsNgModuleLoader } from '@angular/core';
import { UploadFileService } from '../upload-file.service';
import { HttpResponse } from '@angular/common/http';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { Router } from '@angular/router';
import { ImageDataService } from '../image-data.service';
import { PlatformLocation, LocationStrategy } from '@angular/common';
import { NgForm } from '@angular/forms';
import { AuthService } from 'angularx-social-login';
import { Coordinates } from '../coordinates.model';
import Konva from 'konva';
import { Image } from 'konva/types/shapes/Image';
import { WhiteboardPageComponent } from '../whiteboard-page/whiteboard-page.component';
import { ImageDimensionService } from '../image-dimension.service';


@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css'],
})

@Injectable({
  providedIn: 'root'
})


export class FormUploadComponent implements OnInit {
  @Input() colorPicker: String;
  imgLayer: Konva.Layer;
  @HostListener('window:beforeunload') goToPage() {
  }

  constructor(private uploadService: UploadFileService,
    private cpService: ColorPickerService, private router: Router, private imageDataService: ImageDataService, private location: LocationStrategy, platFormLoc: PlatformLocation, private authService: AuthService, private imageDimension:ImageDimensionService) {
    platFormLoc.onPopState(() => {
      this.back();
    });

  }

  // VARIABLES USED
  size: string;
  type: string;
  private uploadedImg: any[];
  private blurredImg: any;
  private color1: string;
  myFiles: any;
  sMsg: File;
  detectedCoordinates: Coordinates[];
  stage: any;
  layer: Konva.Layer;
  konvaValue: any;
  imageObj: any;
  img: any;
  imageWidth:number;
  imageHeight:number;

  ngOnInit() {

    /*
    * ON PAGE INITIALIZATION
    * Calling upload service to get user's settings
    */
    this.uploadService.getSettings().subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        for (let settings of event.body) {
          if (settings.type == "size") {
            this.size = settings.value;
          }
          if (settings.type == 'blur') {
            this.type = settings.value
          }
          if (settings.type == "color") {
            this.type = "colorPicker";
          }
        }
      }
    })


    /*
    *Checking if back is pressed or not 
    * IF YES THEN WE ARE PASSING REQUEST ID AS A PARAMETER 
    * AND GETTING ALL THE IMAGES 
    */
    if (sessionStorage.getItem('check') == "true") {
      this.uploadedImg = [];
      var requestId = sessionStorage.getItem("requestId");
      // do the whole backend processing
      this.uploadService.onBackClick(requestId).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (requestId == event.body.requestId) {
            console.log(event.body.files);
            for (let myUrls of event.body.files) {
              console.log(myUrls);
              this.uploadedImg.push(myUrls);
              console.log(event.body.requestId);
            }
          }
        }
      });
      //AGAIN SETTING THE BACK CHECK TO FALSE 
      sessionStorage.setItem('check', "false");
    }
    else {
      // ELSE IF BACK IS NOT PRESSED THAN REMOVING THE REQUEST ID FROM SESSION CHECK AND EMPTYING THE ARRAY
      this.uploadedImg = [];
      sessionStorage.removeItem('requestId');
    }
  }


  selectFile(e) {
    console.log(e);
    this.myFiles = e.target.files;
  }


  /*
  * FOR UPLOADING THE IMAGES
  */
  upload(event) {
    this.uploadedImg = [];
    this.uploadService.uploadImages(this.myFiles).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        console.log(event.body);

        for (let myUrls of event.body.files) {
          this.uploadedImg.push(myUrls);
        }
        sessionStorage.setItem('requestId', event.body.requestId);
      }
    });
  }


  openSettingsForm() {
    document.getElementById("myForm").style.display = "block";
  }


  closeSettingsForm() {
    document.getElementById("myForm").style.display = "none";
  }


  /*
  * FOR GETTING THE COLOR FROM THE COLOR PICKER
  * AND CONVERTING IT TO RGBA
  */
  public onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    console.log(hsva);
    const rgba = this.cpService.hsvaToRgba(hsva);
    this.color1 = "";
    console.log(rgba);
    for (const [k, v] of Object.entries(rgba)) {
      console.log(`${k}:${v}`);
      this.color1 += `${v}` + "-"
      if (v === 2) break;
    }
    console.log(this.color1);
    console.log(this.cpService.rgbaToCmyk(rgba));
    return this.cpService.rgbaToCmyk(rgba);
  }


  /*
  * THIS IS FOR DETECTING THE FACES AND CREATING A BLUR 
  * ON CLICKING THE PARTICULAR ELEMENT FROM THE LIST OF IMAGES
  */
  detect(event) {
    var clickedImage = event.target || event.srcElement || event.currentTarget;
    var autoGeneratedIdOfImg = clickedImage.attributes.id.ownerElement.src;
    this.uploadService.processImage(autoGeneratedIdOfImg).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        for (let eachCoordinates of event.body) {
          this.detectedCoordinates = event.body;
        }
        console.log(this.detectedCoordinates);
      }
    })
    this.imageDimension.getDimension(autoGeneratedIdOfImg).subscribe((event:any) => {
      if(event instanceof HttpResponse){
        this.imageWidth = event.body.width;
        this.imageHeight = event.body.height;
      }
    })
    
    this.showImage(clickedImage);
    this.createStage(clickedImage);
  }

  /*
  * SHOWS THE CLICKED IMAGE IN THE DASHBOARD
  */
  showImage(image) {
    console.log("called");
    this.blurredImg = image.src;
  }

  /*
  * CREATE A STAGE IN THE CONTAINER
  */
  createStage(image) {
    //CREATING THE STAGE


    const detectedImg = document.querySelector('#stageContainer');
    

  

    console.log("Seeeee");
    console.log( Konva.Image.fromURL(image.src, (darthNode)=> {
      darthNode.setAttrs({
        x: 200,
        y: 50,
        scaleX: 0.5,
        scaleY: 0.5
      });
    }));


    this.stage = new Konva.Stage({
      container: 'container',
      width: this.imageWidth,
      height: this.imageHeight,
      visible: true,
      draggable: true
    });

    this.konvaValue = document.getElementsByClassName("konvajs-content")[0];
    this.konvaValue.style['left'] = '341px';
    this.konvaValue.style['top'] = '120';


    this.layer = new Konva.Layer();
    this.imgLayer = new Konva.Layer();

    this.stage.add(this.layer);
    this.stage.add(this.imgLayer);

    this.imgLayer.setZIndex(0);
    this.layer.setZIndex(1);


    this.imgLayer.add(this.img);

    this.imgLayer.batchDraw();
    this.layer.batchDraw();
  }



  /*
  * CALLING THE EDIT URL
  * THAT NAVIGATES TO THE NEXT URL THAT IS WHITBOARD
  */
  edit() {
    this.router.navigateByUrl('/whiteboard');
    this.imageDataService.updateMessage(this.blurredImg);
  }


  // DETECTS THAT THE BACK BUTTON IS PRESSED
  back() {
    sessionStorage.setItem('check', "true");
  }


  /*
  *SUBMITTING THE SETTINGS FORM
  */
  onSettingsSubmit(settings: NgForm): void {
    let sizeSetting;
    let typeSetting;
    sizeSetting = settings.value.size;
    typeSetting = settings.value.type;
    console.log(sizeSetting + typeSetting);
    if (typeSetting == "colorPicker") {
      typeSetting = this.color1;
    }
    this.uploadService.applySettings(sizeSetting, typeSetting).subscribe((event: any) => {
    })
  }


  /*
  * ON CLICKING LOGOUT BUTTON
  */
  logOut() {
    sessionStorage.removeItem('checkToken');
    sessionStorage.removeItem('loggedUser');
    this.router.navigateByUrl('/');
    this.authService.signOut();
  }

}



