import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeRHPageRoutingModule } from './home-rh-routing.module';

import { HomeRHPage } from './home-rh.page';
import { ComponentsModule } from '../../components/components.module';
import { AgregarEmpleadoPage } from '../agregar-empleado/agregar-empleado.page';
import { AgregarEmpleadoPageModule } from '../agregar-empleado/agregar-empleado.module';

@NgModule({
  entryComponents: [
    AgregarEmpleadoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRHPageRoutingModule,
    ComponentsModule,
    AgregarEmpleadoPageModule
  ],
  declarations: [HomeRHPage]
})
export class HomeRHPageModule {}
