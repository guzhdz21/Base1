import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCabinaPageRoutingModule } from './home-cabina-routing.module';

import { HomeCabinaPage } from './home-cabina.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCabinaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HomeCabinaPage]
})
export class HomeCabinaPageModule {}
