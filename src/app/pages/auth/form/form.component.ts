import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSupabaseService } from 'src/app/services/auth-supabase.service';
import { ACTIONS } from 'src/app/constants/constant';
import { ToastService } from 'angular-toastify';
import { SpinnerService } from 'src/app/services/spinner.service';

export interface OptionsForm {
  id: string;
  label: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Input() options!: OptionsForm;
  authForm!: FormGroup;
  emailCloseBtn: boolean = false;
  passwordCloseBtn: boolean = false;
  disableForm: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authSupabaseService: AuthSupabaseService,
    private _toastService: ToastService,
    private readonly spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.authForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required),
    });
  }

  get getEmail() {
    return this.authForm.get('email') as FormControl;
  }

  get getPassword() {
    return this.authForm.get('password') as FormControl;
  }

  onSubmit(): void {
    this.disableForm = true;
    if (this.options.id == ACTIONS.signIn) {
      this.authSupabaseService.signIn(this.authForm.value.email, this.authForm.value.password).then((resp: any) => {
        this.disableForm = false;
        if (resp.error?.name === "AuthRetryableFetchError") {
          this.spinnerService.hide();
          this._toastService.error('Connection error.');
        }
        if (resp.error?.name === "AuthApiError") {
          this.spinnerService.hide();
          this._toastService.error('Wrong email or password.');
        }
        if (resp.data.user?.role === "authenticated") {
          this.spinnerService.hide();
          this.redirectUser();
        }
      }).catch(error => {
        console.error(error);
        this.disableForm = false;
      });
    } else {
      this.authSupabaseService.signUp(this.authForm.value.email, this.authForm.value.password).then((resp: any) => {
        this.disableForm = false;
        if (resp.error?.name === "AuthRetryableFetchError") {
          this.spinnerService.hide();
          this._toastService.error('Connection error.');
        }
        if (resp.error?.name === "AuthApiError") {
          this.spinnerService.hide();
          this._toastService.error('Connection error.');
        }
        if (resp.data.user.aud === "authenticated") {
          this.spinnerService.hide();
          this._toastService.success('Signed up! To confirm your username, go to your email and click the confirmation link.');
          this.redirectUser();
        }
      }).catch(error => {
        console.error(error);
        this.disableForm = false;
      });
    }
  }

  signInWithGitHub() {
    this.authSupabaseService.signInWithGitHub();
  }

  private redirectUser(): void {
    if (this.options.id == ACTIONS.signIn) {
      this.router.navigate(['/products']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  emailCloseBtnClick(): void {
    this.emailCloseBtn = true;
  }

  passwordCloseBtnClick(): void {
    this.passwordCloseBtn = true;
  }
}
