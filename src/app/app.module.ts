import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarModule } from './template/navbar/navbar.module';
import { AngularToastifyModule } from 'angular-toastify';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarModule,
    AngularToastifyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
