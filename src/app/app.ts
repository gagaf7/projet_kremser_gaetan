import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { DataStore } from './data/datastore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  constructor(private dataStore: DataStore) {
    console.log('🚀 Application démarrée');
  }

  ngOnInit() {
    console.log('🔄 Vérification de la session...');
    this.dataStore.checkSession();
    
    // Vérifier l'état après checkSession
    this.dataStore.isAuthenticated$().subscribe(isAuth => {
      console.log('🔐 État authentification:', isAuth);
    });
    
    this.dataStore.getUser$().subscribe(user => {
      console.log('👤 Utilisateur:', user);
    });
  }
}
