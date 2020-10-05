import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinanzasHomePageRoutingModule } from './finanzas-home-routing.module';

import { FinanzasHomePage } from './finanzas-home.page';
import { ComponentsModule } from '../../components/components.module';
import {NgCalendarModule} from 'ionic2-calendar'
import { ChartsModule } from 'ng2-charts';
import { NuevoMovimientoPage } from '../nuevo-movimiento/nuevo-movimiento.page';
import { NuevoMovimientoPageModule } from '../nuevo-movimiento/nuevo-movimiento.module';

@NgModule({
  entryComponents: [
    NuevoMovimientoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinanzasHomePageRoutingModule,
    ComponentsModule,
    NgCalendarModule,
    ChartsModule,
    NuevoMovimientoPageModule
  ],
  declarations: [FinanzasHomePage]
})
export class FinanzasHomePageModule {}
