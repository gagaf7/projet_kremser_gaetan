import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Les cookies HttpOnly sont automatiquement envoyés par le navigateur
    // avec l'option { withCredentials: true } dans les services
    // Plus besoin d'ajouter manuellement le header Authorization
    
    // Note: Si nécessaire, on peut ajouter d'autres headers ici
    // mais le token JWT est maintenant géré de manière sécurisée via les cookies
    
    return next.handle(request);
  }
}
