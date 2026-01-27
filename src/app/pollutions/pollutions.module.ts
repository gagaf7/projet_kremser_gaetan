import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { POLLUTION_ROUTES } from './pollutions.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(POLLUTION_ROUTES)
  ]
})
export class PollutionsModule { }