import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
 
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { AuthenticationService } from '../authentication.service';
import { HttpResponse, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent{ //implements OnInit {
  private user: SocialUser;
  private loggedIn: string;
  constructor(private authService:AuthService, private oauthServ: AuthenticationService, private router: Router) {}
 
  ngOnInit() {

    if (window.performance) {
      console.info("window.performance works fine on this browser");
    }
      if (performance.navigation.type == 1) {
        console.info( "This page is reloaded" );
      } else {
        console.info( "This page is not reloaded");
      }
    
      this.loggedIn = "false";
     // sessionStorage.setItem('checkToken', null);
    }
   
  // GOOGLE
  signInWithGoogle(): void {
  
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => {
      console.log('userData:', userData);
      this.oauthServ.sendtoRestApiMedthod(userData.email, userData.name).subscribe((event:any)=>{
        if(event instanceof HttpResponse){
          console.log(event.body);
          if(event.body.includes("-1")){
            console.log("called");
            sessionStorage.setItem('checkToken',userData.authToken)
            this.router.navigateByUrl('/dashboard');
          }
          else{
            console.log('Welcome: '+ event.body.name);
            this.loggedIn = "true";
            sessionStorage.setItem('checkToken',userData.authToken)
       
            alert("Mail sent!!! Please verify");
       
          }
        }
      })
    });  
  }

// FACEBOOK
  signInWithFacebook():void{
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(userData => {
      console.log('userData:', userData);
      this.oauthServ.sendtoRestApiMedthod(userData.email, userData.name).subscribe((event:any)=>{
        if(event instanceof HttpResponse){
          if(event.body.email === userData.email){
            sessionStorage.setItem('checkToken', userData.authToken);
            console.log('navigate to dashboard');       
            this.router.navigateByUrl('/dashboard');
          }
        }
      })
    })
  }



  signOut(): void {
    this.authService.signOut();
 //   sessionStorage.setItem('chekToken', null);
  }


  /*
  * FORM LOG IN
  */
  onLogin(logIn){
    console.log(logIn.value);
    
    let valid = true;
    const values:string[] = Object.values(logIn.value);
    const keys = Object.keys(logIn.value);
    let credentials ={
      username: 'admin',
      password : 'password'
    };

    for(let i=0; i<values.length; i++){
      if(values[i] === undefined){
        valid = false;
        let UndefinedItem;
        UndefinedItem = keys[i];
        document.getElementById(UndefinedItem).style.borderBottomStyle = 'solid';
        document.getElementById(UndefinedItem).style.borderBottomColor = '#d33f8d';
      }
    }
    if(values[1]==''){
      valid=false;
      document.getElementById('pass').style.borderBottomStyle = 'solid';
      document.getElementById('pass').style.borderBottomColor = '#d33f8d';
    }

    //email validation
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values[0])){
      
    }
    else{
      document.getElementById('email').style.borderBottomStyle='solid';
      document.getElementById('email').style.borderBottomColor='#d33f8d';
      valid = false;
    }

    if(valid){
      this.oauthServ.onLogIn(values.toString(),credentials).subscribe((event:any)=>{
        if(event instanceof HttpResponse){
          console.log(event);
          if(event.body.includes("-1")){
            alert('Invalid UserName or Password');
          }
          else{
            console.log('Welcome Back'+ event.body);
            sessionStorage.setItem('loggedUser', event.body);
            this.router.navigateByUrl('/dashboard');
          }
        }
      })
    }
  }


onChange(event){
  document.getElementById('email').style.borderBottomStyle='none';
  document.getElementById('pass').style.borderBottomStyle='none';

}
  
}
