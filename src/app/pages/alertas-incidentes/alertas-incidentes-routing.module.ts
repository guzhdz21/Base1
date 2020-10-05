import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertasIncidentesPage } from './alertas-incidentes.page';

const routes: Routes = [
  {
    path: '',
    component: AlertasIncidentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertasIncidentesPageRoutingModule {}
