import { User } from '../../app/service/user';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { username: string; password?: string; email?: string }) {}
}

export class Signup {
  static readonly type = '[Auth] Signup';
  constructor(public payload: User) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SetToken {
  static readonly type = '[Auth] Set Token';
  constructor(public token: string) {}
}

export class CheckSession {
    static readonly type = '[Auth] Check Session';
}