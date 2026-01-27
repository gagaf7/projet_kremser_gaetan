# DataStore

Le **DataStore** est une couche d'abstraction centralisée qui encapsule l'accès au Store NGXS dans l'application Captain Miasm.

## Objectif

Au lieu d'injecter directement le `Store` de NGXS dans chaque composant et de manipuler les actions et les sélecteurs, le DataStore fournit une API simplifiée et typée pour :

- Gérer l'authentification (login, signup, logout, session)
- Gérer les pollutions (CRUD + favoris)
- Améliorer la maintenabilité du code
- Faciliter les tests unitaires

## Utilisation

### Injection

```typescript
import { DataStore } from '../data/datastore';

constructor(private dataStore: DataStore) {}
```

### Authentification

#### Sélecteurs
```typescript
// Observables
this.dataStore.getToken$();
this.dataStore.getUser$();
this.dataStore.isAuthenticated$();

// Snapshots (valeurs synchrones)
const token = this.dataStore.getTokenSnapshot();
const user = this.dataStore.getUserSnapshot();
const isAuth = this.dataStore.isAuthenticatedSnapshot();
```

#### Actions
```typescript
// Login
this.dataStore.login(email, password).subscribe({
  next: () => console.log('Connecté'),
  error: (err) => console.error(err)
});

// Signup
this.dataStore.signup(user).subscribe({
  next: () => console.log('Inscrit'),
  error: (err) => console.error(err)
});

// Logout
this.dataStore.logout();

// Set Token
this.dataStore.setToken(token);

// Check Session
this.dataStore.checkSession();
```

### Pollutions

#### Sélecteurs
```typescript
// Observables
this.pollutions$ = this.dataStore.getPollutions$();
this.favorites$ = this.dataStore.getFavorites$();
this.loading$ = this.dataStore.isLoading$();

// Snapshots
const pollutions = this.dataStore.getPollutionsSnapshot();
const favorites = this.dataStore.getFavoritesSnapshot();
const loading = this.dataStore.isLoadingSnapshot();
```

#### Actions
```typescript
// Charger les pollutions
this.dataStore.loadPollutions();

// Ajouter une pollution
this.dataStore.addPollution(pollution).subscribe({
  next: () => console.log('Pollution ajoutée'),
  error: (err) => console.error(err)
});

// Modifier une pollution
this.dataStore.updatePollution(id, pollution).subscribe({
  next: () => console.log('Pollution modifiée'),
  error: (err) => console.error(err)
});

// Supprimer une pollution
this.dataStore.deletePollution(id).subscribe({
  next: () => console.log('Pollution supprimée'),
  error: (err) => console.error(err)
});

// Ajouter aux favoris
this.dataStore.addFavorite(pollutionId);

// Retirer des favoris
this.dataStore.removeFavorite(pollutionId);

// Charger les favoris
this.dataStore.loadFavorites();
```

## Avantages

1. **Centralisation** : Un seul point d'accès pour toutes les opérations du Store
2. **Simplification** : API plus intuitive que `store.dispatch()` et `store.select()`
3. **Typage** : Meilleur support TypeScript avec autocomplétion
4. **Testabilité** : Facilite le mock du Store dans les tests
5. **Maintenabilité** : Si NGXS doit être remplacé, seul ce fichier doit changer

## Architecture

```
DataStore (src/app/data/datastore.ts)
    ↓
Store NGXS
    ↓
├── AuthState (src/shared/states/auth-state.ts)
│   └── AuthActions (src/shared/actions/auth-actions.ts)
└── PollutionState (src/shared/states/pollution-state.ts)
    └── PollutionActions (src/shared/actions/pollution-actions.ts)
```

## Migration

Tous les composants et services ont été migrés pour utiliser le DataStore au lieu du Store NGXS directement :

- `affiche-pollution.ts`
- `navbar.ts`
- `pollution-summary.ts`
- `pollution-form.ts`
- `pollution-favoris.ts`
- `sign-in.ts`
- `sign-up.ts`
- `app.ts`
- `auth.guard.ts`
- `jwt.interceptor.ts`
