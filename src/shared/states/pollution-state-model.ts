import { Pollution } from '../../app/model/pollution.model';

export interface PollutionStateModel {
    pollutions: Pollution[];
    favorites: Pollution[];
    loading: boolean;
}
