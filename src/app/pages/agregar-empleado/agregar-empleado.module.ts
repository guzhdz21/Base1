import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarEmpleadoPageRoutingModule } from './agregar-empleado-routing.module';

import { AgregarEmpleadoPage } from './agregar-empleado.page';
import { HeaderModalComponent } from '../../components/header-modal/header-modal.component';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarEmpleadoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AgregarEmpleadoPage]
})
export class AgregarEmpleadoPageModule {}
