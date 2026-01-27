import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Pollution } from '../model/pollution.model';
import { PollutionService } from '../service/pollution';
import { DataStore } from '../data/datastore';

@Component({
  selector: 'app-pollution-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pollution-summary.html',
  styleUrls: ['./pollution-summary.css']
})
export class PollutionSummaryComponent implements OnInit {
  pollution: Pollution | null = null;
  loading = true;
  error: string | null = null;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pollutionService: PollutionService,
    private dataStore: DataStore
  ) {
    this.isAuthenticated$ = this.dataStore.isAuthenticated$();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPollution(id);
      }
    });
  }

  loadPollution(id: number): void {
    this.loading = true;
    this.error = null;
    this.pollutionService.getPollutionById(id).subscribe({
      next: (data) => {
        this.pollution = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Pollution non trouvée';
        this.loading = false;
      }
    });
  }

  deletePollution(): void {
    if (!this.pollution || !this.pollution.id) return;

    // Vérifier que l'utilisateur est authentifié
    if (!this.dataStore.isAuthenticatedSnapshot()) {
      alert('Vous devez être connecté pour supprimer un signalement');
      this.router.navigate(['/signin']);
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
      this.dataStore.deletePollution(this.pollution.id).subscribe({
        next: () => {
          console.log('Pollution supprimée via NGXS');
          this.router.navigate(['/pollutions']);
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          if (err.status === 401) {
            alert('Vous devez être connecté pour supprimer un signalement');
            this.router.navigate(['/signin']);
          } else {
            alert('Erreur lors de la suppression');
          }
        }
      });
    }
  }

  isFavorite(): boolean {
    if (!this.pollution || !this.pollution.id) return false;
    const favorites = this.dataStore.getFavoritesSnapshot();
    return favorites.some(p => p.id === this.pollution!.id);
  }

  toggleFavorite(): void {
    if (!this.pollution || !this.pollution.id) return;
    
    if (this.isFavorite()) {
      this.dataStore.removeFavorite(this.pollution.id);
    } else {
      this.dataStore.addFavorite(this.pollution.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/pollutions']);
  }
}    