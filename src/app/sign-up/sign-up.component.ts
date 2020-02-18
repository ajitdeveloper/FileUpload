import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { HttpResponse } from '@angular/common/http';
import { isRegExp } from 'util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private oauthServ: AuthenticationService) { }

  ngOnInit() {
  }
  /*
  * FORM SIGN UP
  */
  onSignUp(signUp) {
    const someThing:string[] = Object.keys(signUp.value);
    console.log(someThing);
    const keys: string[] = Object.values(signUp.value);
    let valid = true;

    // make sure non field are empty
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === undefined||keys[i]=='') {
        let UndefinedItem;
        UndefinedItem = someThing[i];
        document.getElementById(UndefinedItem).style.borderBottomStyle = 'solid';
        document.getElementById(UndefinedItem).style.borderBottomColor = '#d33f8d';
        valid = false;
      }
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(keys[1])){
      
        }
        else{
          document.getElementById('email').style.borderBottomStyle='solid';
          document.getElementById('email').style.borderBottomColor='#d33f8d';
          valid = false;
          console.log(false);
        }

    console.log(keys);
    if (!(keys[2].includes(keys[3]))) {
      valid = false;
      console.log(valid);
      console.log(keys[2]);
      console.log(keys[3]);
      //  alert("Password Didn't Match");
      document.getElementById('pwd').style.borderBottomStyle = 'solid';
      document.getElementById('pwd').style.color = '#d33f8d';
      document.getElementById('repeatpsw').style.borderBottomStyle = 'solid';
      document.getElementById('repeatpsw').style.color = '#d33f8d';

    }


    //valid
    if (valid) {
      console.log(signUp.value)
      this.oauthServ.onFormSignUp(signUp.value.email).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.body.includes("-1")) {
            alert("USER ALREADY EXISTS !!!");
          }
          else {
            alert("Please verify your account. MAIL HAVE BEEN SENT TO YOUR ACCOUNT");
          }
        }

      })

    }
    else {

    }
  }
onChange(event){
 
  document.getElementById('pwd').style.borderBottomStyle='none';
  document.getElementById('repeatpsw').style.borderBottomStyle='none';
  document.getElementById('uname').style.borderBottomStyle='none';
  document.getElementById('email').style.borderBottomStyle='none';
}
}
