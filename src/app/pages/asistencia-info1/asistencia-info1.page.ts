import { Component, OnInit, Input } from '@angular/core';
import { Asistencia, Usuario, Seguridad } from '../../interfaces/interfaces';
import { FireService } from '../../services/fire.service';
import { AccionesService } from '../../services/acciones.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-asistencia-info1',
  templateUrl: './asistencia-info1.page.html',
  styleUrls: ['./asistencia-info1.page.scss'],
})
export class AsistenciaInfo1Page implements OnInit {

  @Input() asistencia : Asistencia;
  @Input() nombre: string;
  @Input() seguridad: Seguridad;
  @Input() id: string;

  fecha: number;

  serviciotText = "";
  supervisor = "";
  horario = null;
  
  horario2 = null;

  constructor(private fireService: FireService,
              private accionesService: AccionesService,
              private modalCtrl: ModalController) { }

  newAsistencia : Asistencia = {
    dia: null,
    fotos: null,
    horario: null,
    numero: null,
    servicio: null,
    retardo: null,
    valido : null
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.newAsistencia.dia = this.asistencia.dia;
    this.newAsistencia.fotos = this.asistencia.fotos;
    this.newAsistencia.horario = this.asistencia.horario;
    this.newAsistencia.numero = this.asistencia.numero;
    this.newAsistencia.servicio = this.asistencia.servicio;
    this.newAsistencia.retardo = this.asistencia.retardo;
    this.newAsistencia.valido = this.asistencia.valido;

    this.fecha = new Date().getDay() -1;
    if(this.fecha == -1) {
      this.fecha = 6;
    }

    var date = new Date();
    date.setHours(this.asistencia.servicio.horario.hora);
    date.setMinutes(this.asistencia.servicio.horario.minutos);
    date.setSeconds(0);
    this.horario = date.toUTCString();

    var date2 = new Date();
    date2.setHours(this.asistencia.horario.hora);
    date2.setMinutes(this.asistencia.horario.minutos);
    date2.setSeconds(0);
    this.horario2 = date2.toUTCString();

    await this.obtenerCliente();
    await this.obtenerSupervisor();
  }

  async obtenerCliente() {
    await this.fireService.getAllClientes().then(res => {
      res.subscribe(val => {
        this.serviciotText = this.seguridad.servicios[this.fecha].servicio.cliente + " - ";
        for (var cliente of val) {
          if(cliente.nombre == this.seguridad.servicios[this.fecha].servicio.cliente) {
            for (var servicio of cliente.servicios) {
              if(servicio.numero == this.seguridad.servicios[this.fecha].servicio.servicio) {
                this.serviciotText += servicio.nombre;
                return;
              }
            }
          }
        }
      });
    });
  }

  async obtenerSupervisor() {
    var fecha = (new Date().getDay()) - 1;
    if(fecha == -1) {
      fecha = 6;
    }
    
    await this.fireService.getAllSupervisores().then(res => {
      res.subscribe(val => {
        for(var supervisor of val) {
          for(var servicio of supervisor.clientes) {
            if(this.seguridad.servicios[fecha].servicio.cliente == servicio) {
              this.obtenerNameSupervisor(supervisor.numero);
              return;
            }
          }
        }
      })
    });
  }

  async obtenerNameSupervisor(numero: number) {
    await this.fireService.getAllUsuarios().then(res => {
      res.subscribe(val => {
        for(var usuario of val) {
          if(usuario.numero == numero) {
            this.supervisor = usuario.nombre;
            break;
          }
        }
      });
    });
    return;
  }

  async validarAsistencia () {
    var ok = false;
    await this.accionesService.presentAlertPersonalizada([{text: 'Ok', handler: (blah) => {ok = true}},
    {text: 'Cancelar', handler: (blah) => {}}], "Validar Asistencia" , 
    "Seguro que deseas validar la asistencia?, despues no se podra cancelar");

    if(ok) {
      this.newAsistencia.valido = true;
      await this.fireService.updateAsistencias(this.newAsistencia, this.id);
      this.modalCtrl.dismiss();
    }
  }

}
