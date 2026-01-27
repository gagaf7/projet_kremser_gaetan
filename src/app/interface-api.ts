import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pollution } from './model/pollution.model';
import { environment } from './environement/environement';

/*
@Injectable({
  providedIn: 'root'
})
export class InterfaceAPI {
  constructor(private http: HttpClient) {}

  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(environment.baseUrl);
  }
}
*/



@Injectable({
  providedIn: 'root'
})
export class InterfaceAPI {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(`${this.baseUrl}/pollutions`);
  }

  createPollution(pollution: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(`${this.baseUrl}/pollutions`, pollution);
  }

  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.baseUrl}/pollutions/${id}`);
  }

  deletePollution(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pollutions/${id}`);
  }

  updatePollution(id: number, pollution: Pollution): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.baseUrl}/pollutions/${id}`, pollution);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/login`, {
      email,
      password
    });
  }

  signup(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/signup`, user);
  }
}

