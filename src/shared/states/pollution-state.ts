import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { GetPollutions, AddPollution, UpdatePollution, DeletePollution, AddFavorite, RemoveFavorite, GetFavorites } from '../actions/pollution-actions';
import { PollutionStateModel } from './pollution-state-model';
import { PollutionService } from '../../app/service/pollution';
import { tap } from 'rxjs/operators';
import { AuthState } from './auth-state';

@State<PollutionStateModel>({
    name: 'pollution',
    defaults: {
        pollutions: [],
        favorites: [],
        loading: false
    }
})
@Injectable()
export class PollutionState {

    constructor(
        private pollutionService: PollutionService,
        private store: Store
    ) {}

    @Selector()
    static pollutions(state: PollutionStateModel) {
        return state.pollutions;
    }

    @Selector()
    static favorites(state: PollutionStateModel) {
        return state.favorites;
    }

    @Selector()
    static loading(state: PollutionStateModel) {
        return state.loading;
    }

    @Action(GetPollutions)
    getPollutions(ctx: StateContext<PollutionStateModel>) {
        ctx.patchState({ loading: true });
        return this.pollutionService.getAllPollutions().pipe(
            tap({
                next: (pollutions) => {
                    console.log('✅ Pollutions chargées:', pollutions);
                    ctx.patchState({
                        pollutions: pollutions,
                        loading: false
                    });
                },
                error: (error) => {
                    console.error('❌ Erreur chargement pollutions:', error);
                    console.error('📋 Status:', error.status);
                    console.error('📋 StatusText:', error.statusText);
                    console.error('📋 URL:', error.url);
                    console.error('📋 Error body:', error.error);
                    console.error('📋 Headers:', error.headers);
                    ctx.patchState({
                        pollutions: [],
                        loading: false
                    });
                }
            })
        );
    }

    @Action(AddPollution)
    addPollution(ctx: StateContext<PollutionStateModel>, action: AddPollution) {
        return this.pollutionService.createPollution(action.payload).pipe(
            tap((pollution) => {
                const state = ctx.getState();
                ctx.patchState({
                    pollutions: [...state.pollutions, pollution]
                });
            })
        );
    }

    @Action(UpdatePollution)
    updatePollution(ctx: StateContext<PollutionStateModel>, action: UpdatePollution) {
        return this.pollutionService.updatePollution(action.id, action.payload).pipe(
            tap((updatedPollution) => {
                const state = ctx.getState();
                const pollutions = [...state.pollutions];
                // updatedPollution from mock allows us to have the ID if needed, but we passed it
                // API might return the updated object
                const index = pollutions.findIndex(p => p.id === action.id);
                if (index > -1) {
                    // Update the item in the array
                    pollutions[index] = { ...pollutions[index], ...action.payload };
                    ctx.patchState({ pollutions });
                }
            })
        );
    }

    @Action(DeletePollution)
    deletePollution(ctx: StateContext<PollutionStateModel>, action: DeletePollution) {
        return this.pollutionService.deletePollution(action.id).pipe(
            tap(() => {
                const state = ctx.getState();
                ctx.patchState({
                    pollutions: state.pollutions.filter(p => p.id !== action.id)
                });
            })
        );
    }

    @Action(GetFavorites)
    getFavorites(ctx: StateContext<PollutionStateModel>) {
        const user = this.store.selectSnapshot(AuthState.user);
        if (user && user.id) {
            return this.pollutionService.getFavorites(user.id).pipe(
                tap((favs) => {
                    ctx.patchState({ favorites: favs });
                })
            );
        } else {
            const favorites = localStorage.getItem('pollutionFavorites');
            const parsedFavorites = favorites ? JSON.parse(favorites) : [];
            ctx.patchState({ favorites: parsedFavorites });
            return;
        }
    }

    @Action(AddFavorite)
    addFavorite(ctx: StateContext<PollutionStateModel>, action: AddFavorite) {
        const state = ctx.getState();
        const pollution = state.pollutions.find(p => p.id === action.pollutionId);
        
        if (!pollution) return;

        const exists = state.favorites.some(p => p.id === action.pollutionId);
        if (exists) return;

        const newFavorites = [...state.favorites, pollution];
        ctx.patchState({ favorites: newFavorites });

        const user = this.store.selectSnapshot(AuthState.user);
        if (user && user.id) {
            return this.pollutionService.addFavorite(user.id, action.pollutionId);
        } else {
            localStorage.setItem('pollutionFavorites', JSON.stringify(newFavorites));
            return;
        }
    }

    @Action(RemoveFavorite)
    removeFavorite(ctx: StateContext<PollutionStateModel>, action: RemoveFavorite) {
        const state = ctx.getState();
        const newFavorites = state.favorites.filter(p => p.id !== action.pollutionId);
        ctx.patchState({ favorites: newFavorites });

        const user = this.store.selectSnapshot(AuthState.user);
        if (user && user.id) {
            return this.pollutionService.removeFavorite(user.id, action.pollutionId);
        } else {
            localStorage.setItem('pollutionFavorites', JSON.stringify(newFavorites));
            return;
        }
    }
}
