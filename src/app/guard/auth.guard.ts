import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataStore } from '../data/datastore';

export const authGuard = () => {
  const dataStore = inject(DataStore);
  const router = inject(Router);

  const isAuthenticated = dataStore.isAuthenticatedSnapshot();
  if (isAuthenticated) {
    return true;
  }

  // Le token est maintenant dans un cookie HttpOnly
  // On vérifie uniquement isAuthenticated
  return router.navigate(['/sign-in']);
};
