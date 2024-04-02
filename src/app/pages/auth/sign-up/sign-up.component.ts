import { Component } from '@angular/core';
import { OptionsForm } from '../form/form.component';
import { ACTIONS } from 'src/app/constants/constant';

@Component({
  selector: 'app-sign-up',
  template: `<app-form [options]="options"></app-form>`,
  styles: ['']
})
export class SignUpComponent {
  options: OptionsForm = {
    id: ACTIONS.signUp,
    label: ACTIONS.signUp
  }
}
