import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  {
    path: 'pollutions',
    loadChildren: () => import('./pollutions/pollutions.module')
      .then(m => m.PollutionsModule)
  },
  { 
    path: 'favoris', 
    loadComponent: () => import('./pollution-favoris/pollution-favoris').then(m => m.PollutionFavorisComponent),
    canActivate: [authGuard]
  },
  { path: 'sign-in', loadComponent: () => import('./sign-in/sign-in').then(m => m.SignIn) },
  { path: 'sign-up', loadComponent: () => import('./sign-up/sign-up').then(m => m.SignUp) }
];