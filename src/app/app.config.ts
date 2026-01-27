import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '../shared/states/auth-state';
import { PollutionState } from '../shared/states/pollution-state';
import { environment } from './environement/environement';
import { JwtInterceptor } from './service/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    importProvidersFrom(
      NgxsModule.forRoot([AuthState, PollutionState], {
        developmentMode: !environment.production
      })
    ),
  ],
};
