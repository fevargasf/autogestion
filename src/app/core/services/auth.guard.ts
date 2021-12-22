import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {
  }
   canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isValidCookie = this.cookieService.get('coraconn') !== null && this.cookieService.get('coraconn') !== undefined;
    if (isValidCookie) {
      return true;
    } 


 /*   canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const cookie = this.cookieService.get('coraconn');
    const isValidCookie = cookie !== "" && cookie !== null && cookie !== undefined;
    console.log(cookie, isValidCookie);
    if (isValidCookie) {
      console.log(isValidCookie)
      return true;
    }  */

    window.location.href = "https://pruebas.corantioquia.gov.co/";
    return false;

  }
}
