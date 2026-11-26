import { Routes } from '@angular/router';
import { CarList } from './features/cars/pages/car-list/car-list';
import { CarDetails } from './features/cars/car-details/car-details';
import { CarForm } from './features/cars/car-form/car-form';
import { Register } from './features/auth/pages/register/register';
import { LoginComponent } from './features/auth/pages/login/login';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [

  { path: '', redirectTo: 'cars', pathMatch: 'full'},
  { path: 'cars', component: CarList},
  { path: 'cars/new', component: CarForm},
  { path: 'cars/:id', component: CarDetails},
  { path: 'cars/:id/edit', component: CarForm, canActivate: [authGuard]},
  { path: 'register', component: Register},
  { path: 'login', component: LoginComponent},

];
