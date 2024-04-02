import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthSupabaseService } from '../services/auth-supabase.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccessToLoginAndRegisterGuard implements CanActivate {

  constructor(private authSupabaseService: AuthSupabaseService, private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authSupabaseService.getSession()
        .then(resp => {
          const session = resp;
          if (session) {
            observer.next(false);
            this.router.navigate(['/products']);
          } else {
            observer.next(true);
          }
          observer.complete();
        })
        .catch(error => {
          console.error(error);
          observer.next(true);
          observer.complete();
        });
    });
  }

}