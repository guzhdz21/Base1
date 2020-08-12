import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCabinaPageRoutingModule } from './home-cabina-routing.module';

import { HomeCabinaPage } from './home-cabina.page';
import { ComponentsModule } from '../../components/components.module';
import { AsistenciaInfo1Page } from '../asistencia-info1/asistencia-info1.page';
import { AsistenciaInfo1PageModule } from '../asistencia-info1/asistencia-info1.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  entryComponents: [
    AsistenciaInfo1Page
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCabinaPageRoutingModule,
    ComponentsModule,
    AsistenciaInfo1PageModule,
    PipesModule
  ],
  declarations: [HomeCabinaPage]
})
export class HomeCabinaPageModule {}
