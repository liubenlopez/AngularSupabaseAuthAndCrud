import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthSupabaseService } from '../services/auth-supabase.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoggedInUserGuard implements CanActivate {

  constructor(private authSupabaseService: AuthSupabaseService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authSupabaseService.getSession()
        .then(resp => {
          const session = resp;
          if (session) {
            observer.next(true);
          } else {
            observer.next(false);
            this.router.navigate(['/home']);
          }
          observer.complete();
        })
        .catch(error => {
          console.error(error);
          observer.next(false);
          observer.complete();
          this.router.navigate(['/home']);
        });
    });
  }

}