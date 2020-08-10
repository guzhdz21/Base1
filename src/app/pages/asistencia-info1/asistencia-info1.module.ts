import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciaInfo1PageRoutingModule } from './asistencia-info1-routing.module';

import { AsistenciaInfo1Page } from './asistencia-info1.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciaInfo1PageRoutingModule,
    ComponentsModule
  ],
  declarations: [AsistenciaInfo1Page]
})
export class AsistenciaInfo1PageModule {}
