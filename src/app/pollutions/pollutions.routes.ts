import { Routes } from '@angular/router';
import { AffichePollution } from '../affiche-pollution/affiche-pollution';
import { PollutionFormComponent } from '../pollution-form/pollution-form';
import { PollutionSummaryComponent } from '../pollution-summary/pollution-summary';
import { authGuard } from '../guard/auth.guard';

export const POLLUTION_ROUTES: Routes = [
  { path: '', component: AffichePollution },
  { path: 'new', component: PollutionFormComponent, canActivate: [authGuard] },
  { path: 'edit/:id', component: PollutionFormComponent, canActivate: [authGuard] },
  { path: ':id', component: PollutionSummaryComponent }
];