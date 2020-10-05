import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarCompradorPageRoutingModule } from './agregar-comprador-routing.module';

import { AgregarCompradorPage } from './agregar-comprador.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarCompradorPageRoutingModule,
    PipesModule
  ],
  declarations: [AgregarCompradorPage]
})
export class AgregarCompradorPageModule {}
