import { Component } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { Observable, Subscription, delay, tap } from 'rxjs';
import { AuthSupabaseService } from './services/auth-supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'supabase-auth-app';
  subscription!: Subscription;
  showLoggedToast: boolean = true;
  email: string | undefined = undefined;

  constructor(private _toastService: ToastService, private readonly authSupabaseService: AuthSupabaseService) {
  }

  ngOnInit(): void {
    this.subscription = this.authSupabaseService.sessionObservable$.subscribe(resp => {
      if (resp) {
        if (this.showLoggedToast) {
          this.showLoggedToast = false;
          this.email = resp.user?.email;
          this.showToast();
        }
      } else {
        this.email = undefined;
        this.showLoggedToast = true;
      }
    });
    setTimeout(() => { document.querySelector(".appspinner")?.remove(); }, 2000);
  }

  ngAfterViewChecked() {
    //Cuando se agrega un setTimeout aqui se genera una secuencia infinita de llamadas al ngAfterViewChecked (no usarlo aqui)
    //El delay de rxjs hace lo mismo
    // document.querySelector(".appspinner")?.remove();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showToast(): void {
    this._toastService.success(`${this.email} is logged in!`);
  }
}
