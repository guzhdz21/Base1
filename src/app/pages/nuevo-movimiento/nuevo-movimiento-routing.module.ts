import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoMovimientoPage } from './nuevo-movimiento.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoMovimientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoMovimientoPageRoutingModule {}
