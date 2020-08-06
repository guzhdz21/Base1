import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCabinaPageRoutingModule } from './home-cabina-routing.module';

import { HomeCabinaPage } from './home-cabina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCabinaPageRoutingModule
  ],
  declarations: [HomeCabinaPage]
})
export class HomeCabinaPageModule {}
