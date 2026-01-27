import { User } from '../../app/service/user';

export interface AuthStateModel {
    user: User | null;
    isAuthenticated: boolean;
}