import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinanzasHomePage } from './finanzas-home.page';

const routes: Routes = [
  {
    path: '',
    component: FinanzasHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanzasHomePageRoutingModule {}
