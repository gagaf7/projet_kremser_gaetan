import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../service/user';
import { DataStore } from '../data/datastore';
import { SearchService } from '../service/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  favorites$: Observable<any[]>;
  currentUser$: Observable<User | null>;

  favoritesCount = 0;
  searchTerm = '';

  constructor(
    private dataStore: DataStore,
    private router: Router,
    private searchService: SearchService
  ) {
    this.favorites$ = this.dataStore.getFavorites$();
    this.currentUser$ = this.dataStore.getUser$();
  }

  ngOnInit(): void {
    this.favorites$.subscribe(favorites => {
      this.favoritesCount = favorites ? favorites.length : 0;
    });

    // Synchroniser avec le service de recherche
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });
  }

  onSearchChange(): void {
    this.searchService.setSearchTerm(this.searchTerm);
    // Rediriger vers la page d'accueil si on n'y est pas déjà
    if (this.router.url !== '/' && this.router.url !== '/pollutions') {
      this.router.navigate(['/']);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }

  logout(): void {
    this.dataStore.logout();
    this.router.navigate(['/']);
  }
}
