import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  

  constructor(private _router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(sessionStorage.getItem('checkToken'));  
    if (sessionStorage.getItem('checkToken') === null && sessionStorage.getItem('loggedUser') === null) {  

      console.log('Setting false');
         this._router.navigateByUrl('/');  
   
        return false;  
    }
    else{
      console.log('Setting true');
      console.log(this._router);
    return true;
    }  
      
}
}
