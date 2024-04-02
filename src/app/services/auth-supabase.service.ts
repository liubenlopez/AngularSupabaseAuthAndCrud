import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthChangeEvent, AuthSession, Session, SupabaseClient, createClient } from '@supabase/supabase-js';
import { BehaviorSubject, Subject } from 'rxjs';
import { SpinnerService } from './spinner.service';


@Injectable({
  providedIn: 'root'
})
export class AuthSupabaseService {
  private supabaseCliente: SupabaseClient;
  _session: AuthSession | null = null;
  sessionBehaviorSubject = new BehaviorSubject<AuthSession | null>(null);
  sessionObservable$ = this.sessionBehaviorSubject.asObservable();

  constructor(private readonly spinnerService: SpinnerService) {
    this.supabaseCliente = createClient(environment.supabase.url, environment.supabase.publicKey);
  }

  //Resgister
  signUp(email: string, password: string) {
    this.spinnerService.show("Signing up ...");
    return this.supabaseCliente.auth.signUp({ email, password });
  }

  //Login
  signIn(email: string, password: string) {
    this.spinnerService.show("Logging in ...");
    return this.supabaseCliente.auth.signInWithPassword({ email, password });
  }

  async signInWithGitHub() {
    const { data, error } = await this.supabaseCliente.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) {
      console.error('Error signing in with GitHub:', error.message);
    } else {
      console.log('Signed in with GitHub:', data);
    }
  };

  //Get session
  getSession(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.supabaseCliente.auth.getSession()
        .then(({ data }) => {
          this._session = data.session;
          this.sessionBehaviorSubject.next(this._session);
          return resolve(this._session);
        })
        .catch((error) => {
          this.sessionBehaviorSubject.next(null);
          return reject(error);
        });
    });
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabaseCliente.auth.onAuthStateChange(callback);
  }

  signOut() {
    this.spinnerService.show("Logging out ...");
    return this.supabaseCliente.auth.signOut();
  }

  ngOnInit(): void {
    this.getSession();
  }
}
