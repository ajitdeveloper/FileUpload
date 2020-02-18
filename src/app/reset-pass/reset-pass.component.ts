import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordServiceService } from '../password-service.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  code:string;
  constructor(private route: ActivatedRoute, private passwordService: PasswordServiceService, private router:Router) {
  
   }
  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.code = params.token;
      console.log(this.code);
    })
  }
  onReset(reset){
    console.log(reset.value);
    const keys = Object.values(reset.value);
    let valid = true;
     // make sure non field are empty
     for(let i=0; i<keys.length;i++){
      if(keys[i]=== undefined){
        valid = false;
      }
    }
    if(keys[0]==""||keys[0]==""){
      valid=false;
    }
    if(keys[0]!== keys[1]){
     // alert("Not Matching !!!");
      valid = false;
    }
    if(valid){
      this.passwordService.onReset(this.code, reset.value.newPassword).subscribe((event:any)=>{
        if(event instanceof HttpResponse){
          console.log(event);
          if(event.body.includes("-1")){
            alert("Invalid !!!");
          }
          else{
            console.log("Welcome Back"+event.body);
            sessionStorage.setItem('loggedUser', event.body);
            this.router.navigateByUrl("/dashboard");
          }
        }
      })
    }
    else{
      document.getElementById('input1').style.borderBottomStyle = 'solid';
      document.getElementById('input1').style.color = '#d33f8d';
      document.getElementById('input2').style.borderBottomStyle = 'solid';
      document.getElementById('input2').style.color = '#d33f8d';
    }
  }

onChange(event){
  document.getElementById('input1').style.borderBottomStyle = 'none';
  document.getElementById('input2').style.borderBottomStyle = 'none';
}
  
}
