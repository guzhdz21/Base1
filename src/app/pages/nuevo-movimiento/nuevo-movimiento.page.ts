import { Component, Input, OnInit } from '@angular/core';
import { FireService } from '../../services/fire.service';
import { DataF, InEgresos } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-nuevo-movimiento',
  templateUrl: './nuevo-movimiento.page.html',
  styleUrls: ['./nuevo-movimiento.page.scss'],
})
export class NuevoMovimientoPage implements OnInit {

  @Input() tipo: string;
  @Input() fecha: Date;

  nacimiento: string = "";
  tituloMonto: string = "";
  descripcionMonto: string = "";
  monto: number = null; 
  icono: string = "";
  dataF: DataF = null;

  constructor(private fireService: FireService,
              private accionesService: AccionesService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if(this.tipo == "ingreso") {
      this.icono = "trending-up";
    } else {
      this.icono = "trending-down"
    }
    this.nacimiento = this.fecha.toISOString();
    await this.obtenerDataF();
  }

  async agregarMonto() {
    
    var ok = false;
    await this.accionesService.presentAlertPersonalizada([{text: 'Realizar', handler: (blah) => {ok = true}},
      {text: 'Cancelar', handler: (blah) => {}}], "Registrar nuevo " + this.tipo , 
      "Deseas registrar el nuevo movimiento?");

    if(ok) {
      var dataFNew: DataF = {
        año: this.dataF.año,
        mes: this.dataF.mes,
        ingresos: this.dataF.ingresos,
        egresos: this.dataF.egresos
      }
  
      var newInEgreso: InEgresos = {
        fecha: new Date(),
        cantidad: this.monto,
        titulo: this.tituloMonto,
        descripcion: this.descripcionMonto
      }
  
      if(this.tipo == "ingreso") {
        dataFNew.ingresos.push(newInEgreso);
      } else {
        dataFNew.egresos.push(newInEgreso);
      }
  
      //@ts-ignore
      await this.fireService.updateDataF(dataFNew, this.dataF.id);
      await this.accionesService.presentToast("Movimiento agregado");
      await this.modalCtrl.dismiss();
    }
  }

  async obtenerDataF() {
    await this.fireService.getAllDataF().then(res => {
      res.subscribe(val => {
        for(var data of val) {
          if(data.mes == this.fecha.getMonth() && data.año == this.fecha.getFullYear()) {
            this.dataF = data;
          }
        }
      });
    });
    return
  }
  
}
