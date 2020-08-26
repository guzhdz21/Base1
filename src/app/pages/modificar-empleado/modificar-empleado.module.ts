import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarEmpleadoPageRoutingModule } from './modificar-empleado-routing.module';

import { ModificarEmpleadoPage } from './modificar-empleado.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarEmpleadoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ModificarEmpleadoPage]
})
export class ModificarEmpleadoPageModule {}
