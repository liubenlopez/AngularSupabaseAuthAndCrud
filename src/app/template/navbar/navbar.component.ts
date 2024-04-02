import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSession } from '@supabase/supabase-js';
import { ToastService } from 'angular-toastify';
import { Subscription } from 'rxjs';
import { AuthSupabaseService } from 'src/app/services/auth-supabase.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  _session!: AuthSession | null;
  email!: string | undefined;
  subscription!: Subscription;
  dropdownPosition: number = 0;

  constructor(
    private readonly authSupabaseService: AuthSupabaseService,
    private router: Router,
    private readonly spinnerService: SpinnerService,
    private _toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getSession();
    this.subscription = this.authSupabaseService.sessionObservable$.subscribe(resp => {
      this._session = resp;
      this.email = this._session?.user?.email;
      this.calculateDropdownPosition();
    });
    this.authSupabaseService.authChanges((_, session) => {
      this._session = session;
      this.email = this._session?.user?.email;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getSession() {
    this.authSupabaseService.getSession()
      .then(resp => {
        this._session = resp;
        this.email = this._session?.user?.email;
        this.calculateDropdownPosition();
      })
      .catch(error => {
        console.error(error);
      });
  }

  logout() {
    this.authSupabaseService.signOut().then(resp => {
      if (resp?.error) {
        this._toastService.error('Connection error.');
      }
      setTimeout(() => { this.spinnerService.hide(); }, 1000);
    });
    this.getSession();
    this.router.navigate(['/home']);
  }

  calculateDropdownPosition(): void {
    if (this._session?.user?.email?.length) {
      if (this._session?.user?.email?.length < 16) {
        this.dropdownPosition = - (8 * (16 - this._session?.user?.email?.length));
      } else {
        this.dropdownPosition = 7 * (this._session?.user?.email?.length - 16);
      }
    } else {
      this.dropdownPosition = 0;
    }
  }
}
