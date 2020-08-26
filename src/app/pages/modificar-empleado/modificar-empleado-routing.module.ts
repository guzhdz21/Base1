import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarEmpleadoPage } from './modificar-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarEmpleadoPageRoutingModule {}
