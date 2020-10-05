import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSupervisorPageRoutingModule } from './home-supervisor-routing.module';

import { HomeSupervisorPage } from './home-supervisor.page';
import { ComponentsModule } from '../../components/components.module';
import { AlertasIncidentesPage } from '../alertas-incidentes/alertas-incidentes.page';
import { AlertasIncidentesPageModule } from '../alertas-incidentes/alertas-incidentes.module';

@NgModule({
  entryComponents: [
    AlertasIncidentesPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeSupervisorPageRoutingModule,
    AlertasIncidentesPageModule,
    ComponentsModule
  ],
  declarations: [HomeSupervisorPage]
})
export class HomeSupervisorPageModule {}
