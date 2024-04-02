import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInUserGuard } from './guards/logged-in-user.guard';
import { AccessToLoginAndRegisterGuard } from './guards/access-to-login-and-register.guard';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'sign-in', loadChildren: () => import('./pages/auth/sign-in/sign-in.module').then(m => m.SignInModule), canActivate: [AccessToLoginAndRegisterGuard] },
  { path: 'sign-up', loadChildren: () => import('./pages/auth/sign-up/sign-up.module').then(m => m.SignUpModule), canActivate: [AccessToLoginAndRegisterGuard] },
  { path: 'products', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule), canActivate: [LoggedInUserGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
