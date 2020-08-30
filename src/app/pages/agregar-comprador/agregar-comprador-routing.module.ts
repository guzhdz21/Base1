import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarCompradorPage } from './agregar-comprador.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarCompradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarCompradorPageRoutingModule {}
