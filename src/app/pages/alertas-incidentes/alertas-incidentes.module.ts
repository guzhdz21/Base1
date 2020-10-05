import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertasIncidentesPageRoutingModule } from './alertas-incidentes-routing.module';

import { AlertasIncidentesPage } from './alertas-incidentes.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertasIncidentesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AlertasIncidentesPage]
})
export class AlertasIncidentesPageModule {}
