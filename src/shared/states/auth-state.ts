import { Injectable } from "@angular/core";
import { Action, State, StateContext, Selector } from "@ngxs/store";
import { Login, Signup, Logout, CheckSession, SetToken } from "../actions/auth-actions";
import { AuthStateModel } from "./auth-state-model";
import { UserService } from "../../app/service/user";
import { tap } from "rxjs/operators";

@State<AuthStateModel>({
    name: "auth",
    defaults: {
        user: null,
        isAuthenticated: false
    }
})
@Injectable()
export class AuthState {

    constructor(private userService: UserService) {}

    @Selector()
    static user(state: AuthStateModel) {
        return state.user;
    }

    @Selector()
    static isAuthenticated(state: AuthStateModel): boolean {
        return state.isAuthenticated;
    }

    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, action: Login) {
        return this.userService.login(action.payload.email!, action.payload.password!).pipe(
            tap((result: any) => {
                // Le token est maintenant dans un cookie HttpOnly (sécurisé)
                // Il n'est plus stocké ni accessible côté client
                ctx.patchState({
                    user: result.utilisateur,
                    isAuthenticated: true
                });
                // On garde seulement les infos user non-sensibles
                localStorage.setItem('user', JSON.stringify(result.utilisateur));
            })
        );
    }

    @Action(SetToken)
    setToken(ctx: StateContext<AuthStateModel>, action: SetToken) {
        // Le token est maintenant géré par les cookies HttpOnly
        // Cette action est conservée pour compatibilité mais ne fait rien
    }

    @Action(Signup)
    signup(ctx: StateContext<AuthStateModel>, action: Signup) {
        return this.userService.signup(action.payload).pipe(
            tap((result: any) => {
                // Le token est maintenant dans un cookie HttpOnly (sécurisé)
                ctx.patchState({
                    user: result.utilisateur,
                    isAuthenticated: true
                });
                // On garde seulement les infos user non-sensibles
                localStorage.setItem('user', JSON.stringify(result.utilisateur));
            })
        );
    }

    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        // Appeler l'API pour supprimer le cookie côté serveur
        return this.userService.logout().pipe(
            tap(() => {
                ctx.setState({
                    user: null,
                    isAuthenticated: false
                });
                localStorage.removeItem('user');
            })
        );
    }

    @Action(CheckSession)
    checkSession(ctx: StateContext<AuthStateModel>) {
        // Vérifier si on a un user dans localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // Restaurer temporairement l'état
                ctx.patchState({
                    user: user,
                    isAuthenticated: true
                });
            } catch (e) {
                // Si le JSON est invalide, nettoyer
                console.error('Erreur parsing user localStorage:', e);
                localStorage.removeItem('user');
                ctx.patchState({
                    user: null,
                    isAuthenticated: false
                });
            }
        } else {
            // Pas de user en localStorage = pas authentifié
            ctx.patchState({
                user: null,
                isAuthenticated: false
            });
        }
    }
}