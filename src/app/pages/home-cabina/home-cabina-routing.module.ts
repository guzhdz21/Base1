import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeCabinaPage } from './home-cabina.page';

const routes: Routes = [
  {
    path: '',
    component: HomeCabinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeCabinaPageRoutingModule {}
