import { Component, OnInit, Input } from '@angular/core';
import { Asistencia, Usuario, Seguridad, Hora, ServicioA } from '../../interfaces/interfaces';
import { FireService } from '../../services/fire.service';
import { AccionesService } from '../../services/acciones.service';
import { ModalController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-asistencia-info1',
  templateUrl: './asistencia-info1.page.html',
  styleUrls: ['./asistencia-info1.page.scss'],
})
export class AsistenciaInfo1Page implements OnInit {

  @Input() id: string;
  @Input() guardia: any;

  fecha: number;

  serviciotText = "";
  supervisor = "";
  horario = null;
  
  horario2 = null;

  constructor(private fireService: FireService,
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private callNumber: CallNumber) { }

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
    this.fecha = new Date().getDay() -1;
    if(this.fecha == -1) {
      this.fecha = 6;
    }

    if(this.guardia.asistencia != null) {
      this.newAsistencia.dia = this.guardia.asistencia.dia;
      this.newAsistencia.fotos = this.guardia.asistencia.fotos;
      this.newAsistencia.horario = this.guardia.asistencia.horario;
      this.newAsistencia.numero = this.guardia.asistencia.numero;
      this.newAsistencia.servicio = this.guardia.asistencia.servicio;
      this.newAsistencia.retardo = this.guardia.asistencia.retardo;
      this.newAsistencia.valido = this.guardia.asistencia.valido;

      var date = new Date();
      date.setHours(this.guardia.asistencia.servicio.horario.hora);
      date.setMinutes(this.guardia.asistencia.servicio.horario.minutos);
      date.setSeconds(0);
      this.horario = date.toUTCString();

      var date2 = new Date();
      date2.setHours(this.guardia.asistencia.horario.hora);
      date2.setMinutes(this.guardia.asistencia.horario.minutos);
      date2.setSeconds(0);
      this.horario2 = date2.toUTCString();
    }

    await this.obtenerCliente();
    await this.obtenerSupervisor();
  }

  async obtenerCliente() {
    await this.fireService.getAllClientes().then(res => {
      res.subscribe(val => {
        this.serviciotText = this.guardia.seguridad.servicios[this.fecha].servicio.cliente + " - ";
        for (var cliente of val) {
          if(cliente.nombre == this.guardia.seguridad.servicios[this.fecha].servicio.cliente) {
            for (var servicio of cliente.servicios) {
              if(servicio.numero == this.guardia.seguridad.servicios[this.fecha].servicio.servicio) {
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
            if(this.guardia.seguridad.servicios[fecha].servicio.cliente == servicio) {
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

  async llamar() {
    if(this.guardia.celular != null) {
      this.callNumber.callNumber(this.guardia.celular.toString(), true)
    } else {
      this.accionesService.presentToast("El elemento no cuenta con un numero disponible para marcar actualmente")
    }
  }

  async registrarAsistencia() {
    var ok = false;
    await this.accionesService.presentAlertPersonalizada([{text: 'Registrar', handler: (blah) => {ok = true}},
      {text: 'Cancelar', handler: (blah) => {}}], "Registrar asistencia del elemento" , 
      "Deseas registrar la asistencia del elemento, despues no se podra cancelar?");

    if(ok) {
      var fecha = new Date();
      var año = fecha.getFullYear();
      var mes = fecha.getMonth();
      var dia = fecha.getDate();
      var fecha2 = new Date(año, mes, dia, 0, 0, 0, 0);

      var hora = fecha.getHours();
      var minutos = fecha.getMinutes();
      var horario: Hora = {
        hora: hora,
        minutos: minutos
      }

      var servicio: ServicioA = this.guardia.seguridad.servicios[this.fecha].servicio;

      var retardo = false;
      var horaRetardo = servicio.horario.hora;
      var minutosRetardo = horario.minutos + 20;
      if(minutosRetardo > 59) {
        horaRetardo += 1;
        minutosRetardo -= 60;
        if(horaRetardo == 25) {
          horaRetardo = 0;
        }
      }
      if(horario.hora == horaRetardo && horario.minutos > minutosRetardo) {
        retardo = true;
      }

      var asistencia: Asistencia = {
        // @ts-ignore
        dia: fecha2,
        fotos: {
          imagenP: null,
          iamgenL: null
        },
        horario: horario,
        numero: this.guardia.seguridad.numero,
        servicio: servicio,
        retardo: retardo,
        valido: true
      }

      await this.fireService.addAsistencias(asistencia);

      this.modalCtrl.dismiss();
    }
  }
}
