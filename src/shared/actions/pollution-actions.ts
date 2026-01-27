import { Pollution } from '../../app/model/pollution.model';

export class GetPollutions {
  static readonly type = '[Pollution] Get Pollutions';
}

export class AddPollution {
  static readonly type = '[Pollution] Add Pollution';
  constructor(public payload: Pollution) {}
}

export class UpdatePollution {
  static readonly type = '[Pollution] Update Pollution';
  constructor(public payload: Pollution, public id: number) {}
}

export class DeletePollution {
  static readonly type = '[Pollution] Delete Pollution';
  constructor(public id: number) {}
}

export class AddFavorite {
  static readonly type = '[Pollution] Add Favorite';
  constructor(public pollutionId: number) {}
}

export class RemoveFavorite {
  static readonly type = '[Pollution] Remove Favorite';
  constructor(public pollutionId: number) {}
}

export class GetFavorites {
  static readonly type = '[Pollution] Get Favorites';
}
