import { Component, OnInit } from '@angular/core';
import { PasswordServiceService } from '../password-service.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  constructor(private passwordService:PasswordServiceService, private router:Router) { }

  ngOnInit() {
  }

  onForget(forget){
    let valid:boolean = true;
    if(forget.value.email === undefined){
      document.getElementById('email').style.borderBottomStyle='solid';
      document.getElementById('email').style.borderBottomColor='#d33f8d';
      valid=false;
    }
      //email validation
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forget.value.email)){
      
      }
      else{
        document.getElementById('email').style.borderBottomStyle='solid';
        document.getElementById('email').style.borderBottomColor='#d33f8d';
        valid = false;
      }

    if(valid){
      this.passwordService.onForget(forget.value.email).subscribe((event:any)=>{
        if(event instanceof HttpResponse){
          console.log(event);
          alert("Reset link send to the Mail !!! Please check your mail id" );
          this.router.navigateByUrl('');
        }
      })

    }
  }

  onChange(event){
    document.getElementById('email').style.borderBottomStyle='none';
  }
}
