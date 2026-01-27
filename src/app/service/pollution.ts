import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pollution } from '../model/pollution.model';
import { environment } from '../environement/environement';

@Injectable({
  providedIn: 'root'
})
export class PollutionService {
  private apiUrl = environment.useMock 
    ? environment.baseUrl 
    : `${environment.baseUrl}/api/pollutions`;

  constructor(private http: HttpClient) {}

  // Get all pollutions with mapping
  getAllPollutions(): Observable<Pollution[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true }).pipe(
      map(pollutions => {
        // Si on utilise le mock, les données sont déjà au bon format (camelCase)
        if (environment.useMock) {
          return pollutions;
        }
        // Sinon (API), on doit mapper du snake_case vers camelCase
        return pollutions.map(p => this.mapPollutionFromAPI(p));
      })
    );
  }

  // Get pollution by id
  getPollutionById(id: number): Observable<Pollution> {
    // En mode mock, on ne peut pas faire GET /mock.json/1, on doit filtrer le tableau
    if (environment.useMock) {
      return this.getAllPollutions().pipe(
        map(pollutions => {
          const p = pollutions.find(p => p.id == id);
          if (!p) throw new Error('Pollution non trouvée');
          return p;
        })
      );
    }

    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map(p => this.mapPollutionFromAPI(p))
    );
  }

  // Create a new pollution
  createPollution(pollution: Pollution): Observable<Pollution> {
    // Si on est en mode Mock, on simule une réussite immédiate
    if (environment.useMock) {
      console.log('Mode Mock: Pollution simulée créée', pollution);
      // On renvoie l'objet tel quel pour faire croire que c'est bon
      return of({ ...pollution, id: Math.floor(Math.random() * 1000) });
    }

    // Mode API normal
    const payload = this.mapPollutionToAPI(pollution);
    return this.http.post<any>(this.apiUrl, payload, { withCredentials: true }).pipe(
      map(p => this.mapPollutionFromAPI(p))
    );
  }

  // Update pollution
  updatePollution(id: number, pollution: Pollution): Observable<any> {
    if (environment.useMock) {
      console.log('Mode Mock: Pollution mise à jour simulée', id, pollution);
      return of({ ...pollution, id });
    }
    const payload = this.mapPollutionToAPI(pollution);
    return this.http.put(`${this.apiUrl}/${id}`, payload, { withCredentials: true });
  }

  // Delete pollution
  deletePollution(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Get favorites for a user
  getFavorites(userId: number): Observable<Pollution[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/api/users/${userId}/favorites`, { withCredentials: true }).pipe(
      map(pollutions => pollutions.map(p => this.mapPollutionFromAPI(p)))
    );
  }

  // Add to favorites (API call only)
  addFavorite(userId: number, pollutionId: number): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/users/${userId}/favorites`, { pollutionId }, { withCredentials: true });
  }

  // Remove from favorites (API call only)
  removeFavorite(userId: number, pollutionId: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/users/${userId}/favorites/${pollutionId}`, { withCredentials: true });
  }

  // Map from API response to Pollution interface
  private mapPollutionFromAPI(apiPollution: any): Pollution {
    return {
      id: apiPollution.id,
      titre: apiPollution.titre,
      type: apiPollution.type_pollution || apiPollution.type, // Fallback
      description: apiPollution.description,
      dateObservation: apiPollution.date_observation || apiPollution.dateObservation,
      lieu: apiPollution.lieu,
      latitude: apiPollution.latitude,
      longitude: apiPollution.longitude,
      photoUrl: apiPollution.photo_url || apiPollution.photoUrl
    };
  }

  // Map from Pollution interface to API format
  private mapPollutionToAPI(pollution: Pollution): any {
    return {
      titre: pollution.titre,
      type: pollution.type,
      description: pollution.description,
      dateObservation: pollution.dateObservation,
      lieu: pollution.lieu,
      latitude: pollution.latitude,
      longitude: pollution.longitude,
      photoUrl: pollution.photoUrl
    };
  }
}
