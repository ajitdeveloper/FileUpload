import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmservService } from '../confirmserv.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  code:string;
  constructor(private route: ActivatedRoute, private confirmService: ConfirmservService, private router:Router) {
  
   }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.code = params.token;
      console.log(this.code);
    })
  }


  confirmThis(){
    this.confirmService.onConfirm(this.code).subscribe((event:any)=>{
      if(event instanceof HttpResponse){
          if(event.body.includes("-1")){
            alert("Invalid !!!");
          }
          else{
            console.log("welcome to dashboard"+ event.body);
            sessionStorage.setItem('loggedUser', event.body);
            this.router.navigateByUrl('/dashboard');
          }
        }
    })
  }
 

}
