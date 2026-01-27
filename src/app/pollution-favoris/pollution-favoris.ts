import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Pollution } from '../model/pollution.model';
import { DataStore } from '../data/datastore';

@Component({
  selector: 'app-pollution-favoris',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pollution-favoris.html',
  styleUrls: ['./pollution-favoris.css']
})
export class PollutionFavorisComponent implements OnInit {
  favorites$: Observable<Pollution[]>;
  loading = false;

  constructor(
    private dataStore: DataStore,
    private router: Router
  ) {
    this.favorites$ = this.dataStore.getFavorites$();
  }

  ngOnInit(): void {
    this.dataStore.loadFavorites();
  }

  removeFavorite(pollutionId: number | undefined): void {
    if (pollutionId) {
      this.dataStore.removeFavorite(pollutionId);
    }
  }

  // isFavorite is not really needed here as we are listing favorites, but if used in template:
  isFavorite(pollutionId: number | undefined): boolean {
    // This is tricky with async pipe. Better to check in template or subscribe.
    // But since this is the favorites page, all items are favorites.
    return true;
  }

  clearAllFavorites(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      // Need to implement ClearFavorites action if needed, or just loop remove.
      // For now I'll skip or implement loop.
      // Or I can add ClearFavorites action.
      // Let's just leave it for now or remove the button if I can't implement it quickly.
      // I'll just remove the method call from template if possible or implement it.
      // I'll implement ClearFavorites action later if requested.
      // For now, I'll just iterate and remove.
      const favorites = this.dataStore.getFavoritesSnapshot();
      favorites.forEach(p => {
          if (p.id) this.dataStore.removeFavorite(p.id);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/pollutions']);
  }
}  

