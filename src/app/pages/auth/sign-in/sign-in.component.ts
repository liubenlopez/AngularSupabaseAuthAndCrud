import { Component } from '@angular/core';
import { OptionsForm } from '../form/form.component';
import { ACTIONS } from 'src/app/constants/constant';


@Component({
  selector: 'app-sign-in',
  template: `<app-form [options]="options"></app-form>`,
  styles: ['']
})
export class SignInComponent {
  options: OptionsForm = {
    id: ACTIONS.signIn,
    label: ACTIONS.signIn
  }
}
