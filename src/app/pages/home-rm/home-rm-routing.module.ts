import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeRmPage } from './home-rm.page';

const routes: Routes = [
  {
    path: '',
    component: HomeRmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRmPageRoutingModule {}
