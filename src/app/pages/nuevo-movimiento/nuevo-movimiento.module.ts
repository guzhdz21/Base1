import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoMovimientoPageRoutingModule } from './nuevo-movimiento-routing.module';

import { NuevoMovimientoPage } from './nuevo-movimiento.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoMovimientoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [NuevoMovimientoPage]
})
export class NuevoMovimientoPageModule {}
