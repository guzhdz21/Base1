import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistenciaInfo1Page } from './asistencia-info1.page';

const routes: Routes = [
  {
    path: '',
    component: AsistenciaInfo1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciaInfo1PageRoutingModule {}
