import { Component, OnInit } from '@angular/core';
import { Usuario, Seguridad, Cliente, Servicio, Incidente, Hora, Supervisor } from '../../interfaces/interfaces';
import { StorageService } from '../../services/storage.service';
import { FireService } from '../../services/fire.service';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { RegAsistenciaPage } from '../reg-asistencia/reg-asistencia.page';
import { Subscription, interval } from 'rxjs';
import { AccionesService } from '../../services/acciones.service';
import { PushFireService } from '../../services/push-fire.service';

@Component({
  selector: 'app-home-guardia',
  templateUrl: './home-guardia.page.html',
  styleUrls: ['./home-guardia.page.scss'],
})
export class HomeGuardiaPage implements OnInit {

  //Variables visuales generales
  asistenciaS: boolean = true;
  reportarS: boolean = false;
  asignacionesS: boolean = false;
  titulo: string = "Informacion General";
  icono: string = "document-text";
  skeleton: boolean = true;

  //Variables visuales de asistencia
  textoBoton: string = "";
  nacimiento: string = new Date().toISOString();
  servicioText: string = "";
  supervisor: string = "";
  horasS: number = null;

  //Varibales del boton asistencia
  asistenciaRegistrada: boolean = false;
  tiempo: boolean = false;
  timer;
  timerSub;
  sinServicio: boolean = true;

  //Vairables visuales de reportar
  abrirFormulario: boolean = false;

  //Variables visuales asignaciones
  dias: any[] = [
    {
      dia: "Lunes",
      ver: false,
      servicio: "Cruz Verde - Norte",
      hora: "16:20",
      tiempo: 24,
      color: "light",
      flecha: "arrow-forward"
    },
    {
      dia: "Martes",
      ver: false,
      servicio: "Cruz Verde - Norte",
      hora: "16:20",
      tiempo: 24,
      color: "light",
      flecha: "arrow-forward"
    },
    {
      dia: "Miercoles",
      ver: false,
      servicio: "Cruz Verde - Norte",
      hora: "16:20",
      tiempo: 24,
      color: "light",
      flecha: "arrow-forward"
    },
    {
      dia: "Jueves",
      ver: false,
      servicio: "Cruz Verde - Norte",
      hora: "16:20",
      tiempo: 24,
      color: "light",
      flecha: "arrow-forward"
    },
    {
      dia: "Viernes",
      ver: false,
      servicio: "Cruz Verde - Norte",
      hora: "16:20",
      tiempo: 24,
      color: "light",
      flecha: "arrow-forward"
    },
    {
      dia: "Sabado",
      ver: false,
      servicio: "Cruz Verde - Norte",
      hora: "16:20",
      tiempo: 24,
      color: "light",
      flecha: "arrow-forward"
    },
    {
      dia: "Domingo",
      ver: false,
      servicio: "Cruz Verde - Norte",
      hora: "16:20",
      tiempo: 24,
      color: "light",
      flecha: "arrow-forward"
    }
  ]

  //Variables form
  tituloAlerta: string = "";
  descripcionAlerta: string ="";

  //Variables de los datos del usuario
  usuarioLocal: Usuario = null;
  usuario : Usuario = {
    contraseña: null,
    nacimiento: null,
    nombre: null,
    numero: null,
    tipo: null,
    fechaDeIngreso: null,
    domicilio: null,
    celular: null,
    CURP: null,
    RFC: null,
    NSS: null,
    papeleria: null
  }
  seguridad: Seguridad;
  cliente: Cliente;
  servicio: Servicio;
  supervisorData: any;
  id: string = null;

  //Variables de funcionalidad
  backButtonSub: Subscription;
  autentificacion;
  autenSub;
  existe: boolean = true;
  dia: number;
  

  usuarioFake: Usuario = {
    contraseña: null,
    nacimiento: null,
    nombre: null,
    numero: null,
    tipo: null,
    fechaDeIngreso: null,
    domicilio: null,
    celular: null,
    CURP: null,
    RFC: null,
    NSS: null,
    papeleria: null
  }

  user: Usuario;

  constructor(private storageService: StorageService,
              private fireService: FireService,
              private modalCtrl: ModalController,
              private plt: Platform,
              private navCtrl: NavController,
              private accionesService: AccionesService,
              private pushFire: PushFireService) { }

  async ngOnInit() {
  }
  
  //Metodos de carga
  async obtenerUsuarioLocal() {
    await this.storageService.cargarUsuario().then(res => {
      this.usuarioLocal = res;
      this.storageService.cargarId().then(res2 => {
        this.id = res2;
        this.obtenerUsuario(res2);
      })
    });
  }

  async obtenerUsuario(id: string) {
    await this.fireService.getUsuario(id).then(res => {
      res.subscribe(val => {
        this.usuario = val;
        this.obtenerSeguridad(val);
      });
    });
  }

  async obtenerSeguridad(usuario: Usuario) {
    await this.fireService.getAllSeguridad().then(res => {
      res.subscribe(val => {
        for(var seg of val) {
          if(usuario.numero == seg.numero) {
            this.seguridad = seg;
            var fecha = (new Date().getDay()) - 1;
            if(fecha == -1) {
              fecha = 6;
            }
            this.horasS = seg.servicios[fecha].servicio.tipo;
            this.obtenerSupervisor(seg);
            this.obtenerClientes(seg, fecha);
            this.checarTiempoInicial(seg, fecha);
            this.obtenerDias(seg, fecha);
            break;
          }
        }
      });
    });
  }

  async obtenerSupervisor(seguridad: Seguridad) {
    await this.fireService.getAllUsuarios().then(res => {
      res.subscribe(val => {
        for(var usuario of val) {
          if(usuario.numero == seguridad.supervisor) {
            this.supervisor = usuario.nombre;
            break;
          }
        }
      });
    });

    await this.fireService.getAllSupervisores().then(res => {
      res.subscribe(val => {
        for(var supervisor of val) {
          if(seguridad.supervisor == supervisor.numero) {
            this.supervisorData = supervisor;
            break;
          }
        }
      })
    });
  }

  async obtenerClientes(seguridad: Seguridad, dia: number) {
    await this.fireService.getAllClientes().then(res => {
      res.subscribe(val => {
        if(seguridad.servicios[dia].servicio.cliente != null) {
          for(var cli of val) {
            if(seguridad.servicios[dia].servicio.cliente == cli.nombre) {
              for(var ser of cli.servicios) {
                if(this.seguridad.servicios[dia].servicio.servicio == ser.numero) {
                  this.cliente = cli;
                  this.servicio = ser;
                  this.servicioText = "";
                  this.servicioText += seguridad.servicios[dia].servicio.cliente + " - " + ser.nombre;
                  this.sinServicio = false;
                  this.verificarAsistencia(seguridad, dia);
                  break;
                }
              }
              break;
            }
          }
        } else {
          this.cliente = null;
          this.servicioText = "Sin servicio";
          this.servicio = null;
          this.sinServicio = true;
          this.horasS = 0;
        }
      });
    });
  }

  async obtenerNacimiento() {
    this.nacimiento = await this.storageService.cargarNacimiento();
  }

  async obtenerDias(seguridad: Seguridad, dia: number) {
    for(var i = 0; i < seguridad.servicios.length; i++) {
      if(seguridad.servicios[i].servicio.cliente != null) {
        var date = new Date();
        date.setHours(seguridad.servicios[i].servicio.horario.hora);
        date.setMinutes(seguridad.servicios[i].servicio.horario.minutos);
        date.setSeconds(0);
        this.dias[i].hora = date.toUTCString();
        this.dias[i].tiempo = seguridad.servicios[i].servicio.tipo
      } else {
        this.dias[i].hora = "NA"
        this.dias[i].tiempo = 0;
      }
    }
    await this.fireService.getAllClientes().then(res => {
      res.subscribe(val => {
        for(var i = 0; i < seguridad.servicios.length; i++) {
          if(seguridad.servicios[i].servicio.cliente != null) {
            for(var cli of val) {
              if(seguridad.servicios[i].servicio.cliente == cli.nombre) {
                for(var ser of cli.servicios) {
                  if(this.seguridad.servicios[i].servicio.servicio == ser.numero) {
                    this.dias[i].servicio = seguridad.servicios[i].servicio.cliente + " - " + ser.nombre;
                    break;
                  }
                }
                break;
              }
            }
          } else {
            this.dias[i].servicio = "Sin Servicio"
          }
        }
      });
    });
    this.dias[dia].color = "primary";
    this.dias[dia].dia += " (Hoy)";
  }

  //Metodos de verificacion
  async verificarAsistencia(seguridad: Seguridad, dia2: number) {
    var fecha = new Date();
    var fecha = new Date();
    var año = fecha.getFullYear();
    var mes = fecha.getMonth();
    var dia = fecha.getDate();
    var fecha2 = new Date(año, mes, dia, 0, 0, 0, 0);
    await this.fireService.getAllAsistencias().then(res => {
      res.subscribe(val => {
        for(var asis of val) {
          if(asis.numero == seguridad.numero && asis.dia.toDate().toUTCString() == fecha2.toUTCString()) {
            console.log(dia2);
            if(asis.servicio.cliente == seguridad.servicios[dia2].servicio.cliente 
              && asis.servicio.servicio == seguridad.servicios[dia2].servicio.servicio) {
              this.asistenciaRegistrada = true;
              this.textoBoton = "Ya has registrado tu aistencia de hoy";
              break;
            } 
          }
        }
      });
    });
  }

  checarTiempoInicial(seguridad: Seguridad, dia: number) {
    if(seguridad.servicios[dia].servicio.cliente == null) {
      return;
    }
    var tiempo = new Date();
    var hora = tiempo.getHours();
    var minutos = tiempo.getMinutes();
    var horaA = this.seguridad.servicios[dia].servicio.horario.hora + 1;

    if(horaA == 25) {
      horaA = 0;
      if(horaA >= hora) {
        if(seguridad.servicios[dia].servicio.horario.minutos < minutos) {
          this.tiempo = true;
          this.textoBoton = "Ya no puedes registrar asistencia ya que la tolerancia a sido exedida"
        }
      }
      return;
    }

    if(horaA <= hora) {
      if(seguridad.servicios[dia].servicio.horario.minutos < minutos) {
        this.tiempo = true;
        this.textoBoton = "Ya no puedes registrar asistencia ya que la tolerancia a sido exedida"
      }
      return;
    }

  }

  checarTiempo() {
    if(this.seguridad && this.dia) {
      var tiempo = new Date();
      var hora = tiempo.getHours();
      var minutos = tiempo.getMinutes();
      var horaA = this.seguridad.servicios[this.dia].servicio.horario.hora + 1;

      if(horaA == 25) {
        horaA = 0;
        if(horaA >= hora) {
          if(this.seguridad.servicios[this.dia].servicio.horario.minutos < minutos) {
            this.modalCtrl.dismiss();
            this.tiempo = true;
            this.textoBoton = "Ya no puedes registrar asistencia ya que la tolerancia a sido exedida"
          }
        }
        return;
      }

      if(horaA <= hora) {
        if(this.seguridad.servicios[this.dia].servicio.horario.minutos < minutos) {
          this.modalCtrl.dismiss();
          this.tiempo = true;
          this.textoBoton = "Ya no puedes registrar asistencia ya que la tolerancia a sido exedida"
        }
        return;
      }

    }
  }

  async cargarUsuarioComparar() {
    if(this.usuarioLocal != null && this.id != null) {
      this.fireService.getUsuario(this.id).then(res => {
        res.subscribe(val => {
          if(val) {
            this.user = val;
          } else {
            this.existe = false;
          }
        });
      });
      if(this.existe) {
        this.autentificar();
      } else {
        this.procesoBorrado();
      }
    }
    return;
  }

  async autentificar() {
    if(this.user && this.usuarioLocal != null) {
      if(this.user.numero != this.usuarioLocal.numero 
        || this.usuarioLocal.contraseña != this.user.contraseña 
        || this.user.tipo != "Elemento seguridad") {
        await this.autenSub.unsubscribe();
        await this.timerSub.unsubscribe();
        await this.procesoSalida();
        this.modalCtrl.dismiss();
        await this.navCtrl.navigateRoot("/login");
      }
    }
    return;
  }

  async procesoSalida() {
    await this.accionesService.presentAlertGenerica("Alerta de Seguridad", "Algunos de tus datos indispenables" 
        + " (contraseña, numero, etc..) han sido modificados, por seguridad tendras que volver a ingresar a tu cuenta");
    await this.storageService.guardarId(null);
    await this.storageService.guardarUsuario(this.usuarioFake);
    await this.storageService.guardarNacimiento(null);
    return;
  }

  async procesoBorrado() {
    await this.autenSub.unsubscribe();
    await this.timerSub.unsubscribe();
    await this.procesoBorrado2();
    return;
  }

  async procesoBorrado2() {
    await this.accionesService.presentAlertGenerica("Error", "Tu usuario no se encontra registrado," 
        + " por seguridad tendras que volver a ingresar a tu cuenta");
    await this.storageService.guardarId(null);
    await this.storageService.guardarUsuario(this.usuarioFake);
    await this.storageService.guardarNacimiento(null);
    await this.navCtrl.navigateRoot("/login");
    return;
  }

  //Metodos de la ventana e interaccion
  segment(event) {
    switch (event.detail.value) {

      case 'Asistencia': {
        this.asistenciaS = true;
        this.reportarS = false;
        this.asignacionesS = false;
        this.titulo = "Informacion General";
        this.icono = "document-text";
        this.abrirFormulario = false;
        this.tituloAlerta = "";
        this.descripcionAlerta = "";
        break;
      }

      case 'Reportar': {
        this.asistenciaS = false;
        this.reportarS = true;
        this.asignacionesS = false;
        this.titulo = "Reportar Incidente";
        this.icono = "megaphone"
        break;
      }

      case 'Asignaciones': {
        this.asistenciaS = false;
        this.reportarS = true;
        this.asignacionesS = false;
        this.titulo = "Asignaciones de la Semana";
        this.icono = "calendar"
        this.abrirFormulario = false;
        this.tituloAlerta = "";
        this.descripcionAlerta = "";
        break;
      }

    }
  }

  async abrirRegistroAsistencia() {
    const modal = await this.modalCtrl.create({
      component: RegAsistenciaPage,
      componentProps: {
        servicioText: this.servicioText,
        hora: this.seguridad.servicios[this.dia].servicio.horario.hora,
        minutos: this.seguridad.servicios[this.dia].servicio.horario.minutos,
        servicio: this.seguridad.servicios[this.dia].servicio,
        numero: this.usuario.numero
      }
    });
    await modal.present();
    const {data}  = await modal.onDidDismiss();
    this.asistenciaRegistrada = data.registrado;
    this.textoBoton = "Ya has registrado tu aistencia de hoy";
  }

  abrirFormularioReporte() {
    this.abrirFormulario = true;
  }

  abrirDia(i: number) {
    this.dias[i].ver = !this.dias[i].ver;
    if(this.dias[i].flecha == "arrow-down") {
      this.dias[i].flecha = "arrow-forward"
    } else {
      this.dias[i].flecha = "arrow-down"
    }
  }

  //Metodos de reporte
  cancelarAlerta() {
    this.abrirFormulario = false;
    this.tituloAlerta = "";
    this.descripcionAlerta = "";
  }

  async enviarAlerta() {
    await this.fireService.getAllDispositivos().then(res => {
      res.subscribe(val => {
        for (var dis of val) {
          if(dis.numero == this.seguridad.supervisor) {
            console.log(dis.token);
            this.pushFire.enviarPush(this.tituloAlerta, this.descripcionAlerta, dis.token, this.servicioText).subscribe();
            this.accionesService.presentToast("Alerta enviada");
            this.abrirFormulario = false;
            this.tituloAlerta = "";
            this.descripcionAlerta = "";
            return;
          }
        }
        this.pushFire.enviarPush(this.tituloAlerta, this.descripcionAlerta, "1", this.servicioText);
        this.accionesService.presentToast("Alerta enviada");
        this.abrirFormulario = false;
        this.tituloAlerta = "";
        this.descripcionAlerta = "";
        return;
      });
    });

    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var horario: Hora = {
      hora: hora,
      minutos: minutos
    }

    var incidente: Incidente = {
      numero: this.usuario.numero,
      nombre: this.usuario.nombre,
      servicio: this.servicioText,
      titulo: this.tituloAlerta,
      descripcion: this.descripcionAlerta,
      hora: horario
    }

    var supervisor: Supervisor = {
      numero: this.supervisorData.numero,
      alertas: this.supervisorData.alertas
    }

    await supervisor.alertas.push(incidente);
    //@ts-ignore
    await this.fireService.updateSupervisores(supervisor, this.supervisorData.id);
    return;
  }

  //Metodos que manejan la navegacion de paginas
  async ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, async () => {
      navigator["app"].exitApp();
    });
  }

  async ionViewWillEnter() {
    var fecha = (new Date().getDay()) - 1;
    if(fecha == -1) {
      fecha = 6;
    }
    this.dia = fecha;
    await this.reinicioVariables();
    await this.obtenerUsuarioLocal();
    await this.obtenerNacimiento();

    this.timer = interval(10000);
    this.timerSub = this.timer.subscribe(x => {
      if(this.sinServicio == false && this.asistenciaRegistrada == false) {
        if(this.tiempo == true) {
          this.timerSub.unsubscribe();
        } else {
          this.checarTiempo();
        }
      }
    });

    this.autentificacion = interval(3500);
    this.autenSub = await this.autentificacion.subscribe(x => {
      console.log("verificar");
      this.cargarUsuarioComparar();
    });
    
    await this.delay(2000);
    this.skeleton = false;
  }

  reinicioVariables() {
    //Variables visuales generales
    this.asistenciaS = true;
    this.reportarS = false;
    this.asignacionesS = false;
    this.titulo = "Informacion General";
    this.icono = "document-text";

    //Variables visuales de asistencia
    this.textoBoton = "";
    this.nacimiento = new Date().toISOString();
    this.servicioText = "";
    this.supervisor = "";
    this.horasS = null;

    //Varibales del boton asistencia
    this.asistenciaRegistrada = false;
    this.tiempo = false;
    this.timer = null;
    this.timerSub = null;
    this.sinServicio = true;

    //Variables de los datos del usuario
    this.usuarioLocal = null;
    this.usuario = {
      contraseña: null,
      nacimiento: null,
      nombre: null,
      numero: null,
      tipo: null,
      fechaDeIngreso: null,
      domicilio: null,
      celular: null,
      CURP: null,
      RFC: null,
      NSS: null,
      papeleria: null
    }
    this.seguridad = null;
    this.cliente = null;
    this.servicio = null;
    this.id = null;

    //Variables de funcionalidad
    this.autentificacion = null;
    this.autenSub = null;
    this.existe = true;

    this.usuarioFake = {
      contraseña: null,
      nacimiento: null,
      nombre: null,
      numero: null,
      tipo: null,
      fechaDeIngreso: null,
      domicilio: null,
      celular: null,
      CURP: null,
      RFC: null,
      NSS: null,
      papeleria: null
    }

    this.user = null;
    return;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async ionViewWillLeave() {
    await this.timerSub.unsubscribe();
    await this.autenSub.unsubscribe();
  }
}
