import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { 
  Login, 
  Signup, 
  Logout, 
  CheckSession, 
  SetToken 
} from '../../shared/actions/auth-actions';
import { 
  GetPollutions, 
  AddPollution, 
  UpdatePollution, 
  DeletePollution, 
  AddFavorite, 
  RemoveFavorite, 
  GetFavorites 
} from '../../shared/actions/pollution-actions';
import { AuthState } from '../../shared/states/auth-state';
import { PollutionState } from '../../shared/states/pollution-state';
import { Pollution } from '../model/pollution.model';
import { User } from '../service/user';

@Injectable({
  providedIn: 'root'
})
export class DataStore {

  constructor(private store: Store) {}

  // ========== AUTH SELECTORS ==========
  
  // Note: Le token n'est plus stocké dans le state car il est géré par des cookies HttpOnly
  // Ces méthodes sont conservées pour compatibilité mais retournent null

  getUser$(): Observable<User | null> {
    return this.store.select(AuthState.user);
  }

  isAuthenticated$(): Observable<boolean> {
    return this.store.select(AuthState.isAuthenticated);
  }

  getUserSnapshot(): User | null {
    return this.store.selectSnapshot(AuthState.user);
  }

  isAuthenticatedSnapshot(): boolean {
    return this.store.selectSnapshot(AuthState.isAuthenticated);
  }

  // ========== AUTH ACTIONS ==========

  login(email: string, password: string): Observable<any> {
    return this.store.dispatch(new Login({ username: '', email, password }));
  }

  signup(user: User): Observable<any> {
    return this.store.dispatch(new Signup(user));
  }

  logout(): Observable<any> {
    return this.store.dispatch(new Logout());
  }

  checkSession(): Observable<any> {
    return this.store.dispatch(new CheckSession());
  }

  // ========== POLLUTION SELECTORS ==========

  getPollutions$(): Observable<Pollution[]> {
    return this.store.select(PollutionState.pollutions);
  }

  getFavorites$(): Observable<Pollution[]> {
    return this.store.select(PollutionState.favorites);
  }

  isLoading$(): Observable<boolean> {
    return this.store.select(PollutionState.loading);
  }

  getPollutionsSnapshot(): Pollution[] {
    return this.store.selectSnapshot(PollutionState.pollutions);
  }

  getFavoritesSnapshot(): Pollution[] {
    return this.store.selectSnapshot(PollutionState.favorites);
  }

  isLoadingSnapshot(): boolean {
    return this.store.selectSnapshot(PollutionState.loading);
  }

  // ========== POLLUTION ACTIONS ==========

  loadPollutions(): Observable<any> {
    return this.store.dispatch(new GetPollutions());
  }

  addPollution(pollution: Pollution): Observable<any> {
    return this.store.dispatch(new AddPollution(pollution));
  }

  updatePollution(id: number, pollution: Pollution): Observable<any> {
    return this.store.dispatch(new UpdatePollution(pollution, id));
  }

  deletePollution(id: number): Observable<any> {
    return this.store.dispatch(new DeletePollution(id));
  }

  addFavorite(pollutionId: number): Observable<any> {
    return this.store.dispatch(new AddFavorite(pollutionId));
  }

  removeFavorite(pollutionId: number): Observable<any> {
    return this.store.dispatch(new RemoveFavorite(pollutionId));
  }

  loadFavorites(): Observable<any> {
    return this.store.dispatch(new GetFavorites());
  }
}
