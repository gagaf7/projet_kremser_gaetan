import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthState } from '../shared/states/auth-state';
import { PollutionState } from '../shared/states/pollution-state';
import { environment } from './environement/environement';
import { JwtInterceptor } from './service/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch() // Permet l'envoi automatique des cookies avec les requêtes
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    importProvidersFrom(
      NgxsModule.forRoot([AuthState, PollutionState], {
        developmentMode: !environment.production
      }),
      NgxsLoggerPluginModule.forRoot(),
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: environment.production, // Désactivé en production
        maxAge: 25 // Nombre d'états conservés dans l'historique
        // Note: Le devtools ne devrait pas persister le state dans localStorage par défaut
      })
    ),
  ],
};
