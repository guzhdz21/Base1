import { Component, Input, OnInit } from '@angular/core';
import { Supervisor, Incidente } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-alertas-incidentes',
  templateUrl: './alertas-incidentes.page.html',
  styleUrls: ['./alertas-incidentes.page.scss'],
})
export class AlertasIncidentesPage implements OnInit {

  @Input() supervisor: Supervisor;

  alertas: any[] = [];

  constructor(private accionesService: AccionesService) { }

  ngOnInit() {
  }

  async abrirAlerta(i) {
    await this.accionesService.presentAlertGenerica("Informacion de la alerta", "Titulo: " + this.alertas[i].titulo
    + "<br>"
    + "Servicio: " + this.alertas[i].descripcion
    + "<br>"
    + "Descripcion: " + this.alertas[i].descripcion
    + "<br>"
    + "Elemento: " + this.alertas[i].nombre
    + "<br>"
    + "Dia y hora: " + this.alertas[i].horaShow);
  }

  ionViewWillEnter() {
    console.log(this.supervisor.alertas.length-1);
    for (let i = this.supervisor.alertas.length-1; i >= 0; i--) {
      var incidente = {
        numero: this.supervisor.alertas[i].numero,
        nombre: this.supervisor.alertas[i].nombre,
        servicio: this.supervisor.alertas[i].servicio,
        titulo: this.supervisor.alertas[i].titulo,
        descripcion: this.supervisor.alertas[i].descripcion,
        hora: this.supervisor.alertas[i].hora,
        horaShow: this.supervisor.alertas[i].hora.toLocaleString([], {day: "2-digit"
        , month: "2-digit", hour: "2-digit", minute: "2-digit"})
      }
      this.alertas.push(incidente);
    }
  } 

}
