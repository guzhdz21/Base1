import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeRmPageRoutingModule } from './home-rm-routing.module';

import { HomeRmPage } from './home-rm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRmPageRoutingModule
  ],
  declarations: [HomeRmPage]
})
export class HomeRmPageModule {}
