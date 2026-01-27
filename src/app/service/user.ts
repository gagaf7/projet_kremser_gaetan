import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environement/environement';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  utilisateur?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // CORRECTION ICI : Ajout de /api
  private baseUrl = `${environment.baseUrl}/api/users`; 
  
  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // Get user by id
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  // Create a new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  // Update user
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, user);
  }

  // Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Login
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true });
  }

  // Signup
  signup(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, user, { withCredentials: true });
  }

  // Logout
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }
}