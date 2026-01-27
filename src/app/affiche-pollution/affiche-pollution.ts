import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pollution } from '../model/pollution.model';
import { DataStore } from '../data/datastore';
import { SearchService } from '../service/search.service';

@Component({
  selector: 'app-affiche-pollution',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './affiche-pollution.html',
  styleUrls: ['./affiche-pollution.css']
})
export class AffichePollution implements OnInit {
  pollutions$: Observable<Pollution[]>;
  filteredPollutions$: Observable<Pollution[]>;
  loading$: Observable<boolean>;
  favorites$: Observable<Pollution[]>;

  error: string | null = null;

  constructor(
    private dataStore: DataStore,
    private searchService: SearchService
  ) {
    this.pollutions$ = this.dataStore.getPollutions$();
    this.loading$ = this.dataStore.isLoading$();
    this.favorites$ = this.dataStore.getFavorites$();

    // Combiner les pollutions avec le terme de recherche pour filtrer
    this.filteredPollutions$ = combineLatest([
      this.pollutions$,
      this.searchService.searchTerm$
    ]).pipe(
      map(([pollutions, searchTerm]) => {
        let filtered = pollutions;
        
        if (searchTerm && searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          filtered = pollutions.filter(pollution => 
            pollution.titre?.toLowerCase().includes(term) ||
            pollution.type?.toLowerCase().includes(term) ||
            pollution.description?.toLowerCase().includes(term) ||
            pollution.lieu?.toLowerCase().includes(term)
          );
        }
        
        // Trier par date, de la plus ancienne à la plus récente
        return filtered.sort((a, b) => {
          const dateA = new Date(a.dateObservation).getTime();
          const dateB = new Date(b.dateObservation).getTime();
          return dateA - dateB;
        });
      })
    );
  }

  ngOnInit(): void {
    this.dataStore.loadPollutions();
    this.dataStore.loadFavorites();
  }

  toggleFavorite(pollution: Pollution): void {
    if (this.isFavorite(pollution.id)) {
      this.dataStore.removeFavorite(pollution.id!);
    } else {
      this.dataStore.addFavorite(pollution.id!);
    }
  }

  isFavorite(pollutionId: number | undefined): boolean {
    if (!pollutionId) return false;
    const favorites = this.dataStore.getFavoritesSnapshot();
    return favorites.some(p => p.id === pollutionId);
  }
}
