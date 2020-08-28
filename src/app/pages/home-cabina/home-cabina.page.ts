import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Usuario, Seguridad, Cliente } from '../../interfaces/interfaces';
import { StorageService } from '../../services/storage.service';
import { FireService } from '../../services/fire.service';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { AsistenciaInfo1Page } from '../asistencia-info1/asistencia-info1.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home-cabina',
  templateUrl: './home-cabina.page.html',
  styleUrls: ['./home-cabina.page.scss'],
})
export class HomeCabinaPage implements OnInit {

  //Variables visuales generales
  titulo: string = "Turno Matutino";
  icono: string = "sunny";
  fecha: number = 1;
  carga: boolean = false;
  skeleton = true;
  cabina = [
    {
      icono: 'download-outline',
      nombre: 'Excel',
      irA: ''
    },
    {
      icono: 'log-out-outline',
      nombre: 'Cerrar Sesion',
      irA: '/login'
    }
  ];

  //Variables de funcionalidad
  backButtonSub: Subscription;
  autentificacion;
  autenSub;
  user: Usuario;
  existe: boolean = true;
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
  textoBuscar: string = "";

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
  id: string = null;
  clientes: Cliente[];
  guardias: any[] = [];
  excelArray: any [] = [];

  constructor(private storageService: StorageService,
              private fireService: FireService,
              private navCtrl: NavController,
              private accionesService: AccionesService,
              private plt: Platform,
              private modalCtrl: ModalController,
              private callNumber: CallNumber) { }

  ngOnInit() {
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
      });
    });
  }

  async obtenerSeguridad() {
    await this.fireService.getAllSeguridad().then(res => {
      res.subscribe(val => {
        this.guardias = [];
        for (var seg of val) {
          this.obtenerSeguridad2(seg);
        }
      });
    });
    this.carga = true;
    return;
  }

  async obtenerSeguridad2(seguridad: Seguridad) {
    await this.fireService.getAllUsuarios().then (res => {
      res.subscribe(val => {
        for (var usuario of val) {
          if(usuario.numero == seguridad.numero) {
            this.obtenerAsistencias(seguridad, usuario);
            break;
          }
        }
      });
    });
    return;
  }

  async obtenerAsistencias(seguridad: Seguridad, usuario: Usuario) {
    var fecha = new Date();
    await this.fireService.getAllAsistencias().then(res => {
      res.subscribe(val => {
        if(this.guardias.length != 0 && this.guardias[0].seguridad.numero == seguridad.numero) {
          this.guardias = [];
        }
        for (var asis of val) {
          if(asis.dia.toDate().getDate() == fecha.getDate() 
          && asis.dia.toDate().getMonth() == fecha.getMonth() 
          && asis.dia.toDate().getFullYear() == fecha.getFullYear() 
          && asis.numero == seguridad.numero) {
            var guardia = {
              seguridad: seguridad,
              asistencia: asis,
              nombre: usuario.nombre,
              celular: usuario.celular
            };
            this.guardias.push(guardia);
            return;
          }
        }
        var guardia2 = {
          seguridad: seguridad,
          asistencia: null,
          nombre: usuario.nombre,
          celular: usuario.celular
        };
        this.guardias.push(guardia2);
      });
    });
    return;
  }

  async obtenerClientes() {
    await this.fireService.getAllClientes().then(res => {
      res.subscribe(val => {
        this.clientes = val;
      });
    });
  }

  //Metodos de verificacion
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
        || this.user.tipo != "Cabina") {
        await this.autenSub.unsubscribe();
        await this.procesoSalida();
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

      case 'Matutino': {
        this.titulo = "Turno Matutino";
        this.icono = "sunny";
        break;
      }

      case 'Nocturno': {
        this.titulo = "Turno Nocturno";
        this.icono = "moon";
        break;
      }

    }
  }

  async abrirAsistencia(i) {
    if( this.guardias[i].asistencia != null) {
      const modal = await this.modalCtrl.create({
        component: AsistenciaInfo1Page,
        componentProps: {
          asistencia: this.guardias[i].asistencia,
          nombre: this.guardias[i].nombre,
          seguridad: this.guardias[i].seguridad,
          id: this.guardias[i].asistencia.id
        }
      });
      await modal.present();
      await modal.onDidDismiss();
    } else {
      this.accionesService.presentToast("El elemento no tiene registro de asistencia");
    }
  }

  async buscar(event) {
    this.textoBuscar = event.detail.value;
  }

  async llamar(i) {
    this.callNumber.callNumber(this.guardias[i].celular.toString(), true)
  }

  async redirigir(nombre: string, irA: string) {
    if(nombre == "Cerrar Sesion") {
      var ok = false;
      await this.accionesService.presentAlertPersonalizada([{text: 'Ok', handler: (blah) => {ok = true}},
      {text: 'Cancelar', handler: (blah) => {}}], "Cerrar Sesion" , 
      "Seguro que deseas cerrar sesion?");
      if(ok) {
        await this.storageService.eliminarUsuario();
      } else {
        return;
      }
    }
    if(nombre == "Excel") {
      var ok = false;
      await this.accionesService.presentAlertPersonalizada([{text: 'Ok', handler: (blah) => {ok = true}},
      {text: 'Cancelar', handler: (blah) => {}}], "Descargar archivo Excel" , 
      "Deseas descargar un registro de los servicios de los guardias en un archivo de Excel?");
      if(ok) {
        await this.excel();
        return;
      } else {
        return;
      }
    }
    await this.navCtrl.navigateRoot(irA);
  }

  //Metodos de entrada y salida
  async ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, async () => {
      navigator["app"].exitApp();
    });
  }

  async ionViewWillEnter() {

    await this.reinicioVariables();
    this.fecha = new Date().getDay() - 1 ;
    if(this.fecha == -1) {
      this.fecha = 6;
    }
    await this.obtenerUsuarioLocal();
    await this.obtenerSeguridad();
    await this.obtenerClientes();

    this.autentificacion = interval(3500);
    this.autenSub = await this.autentificacion.subscribe(x => {
      console.log("verificar");
      this.cargarUsuarioComparar();
    });
    await this.delay(2000);
    this.skeleton = false;
  }

  async ionViewWillLeave() {
    await this.autenSub.unsubscribe();
  }

  reinicioVariables() {
    this.titulo = "Turno Matutino";
    this.icono = "sunny";
    this.fecha = 1;
    this.carga = false;
    this.skeleton = true;

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
    this.id = null;
    this.guardias = [];

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
    this.textoBuscar = "";
    return;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  excel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    for(var cliente of this.clientes) {

      this.excelArray = [];
      for(var guardia of this.guardias) {
        if(guardia.seguridad.servicios[this.fecha].servicio.cliente == cliente.nombre) {
          var aux = "";
          for (var servicio of cliente.servicios) {
            if(servicio.numero == guardia.seguridad.servicios[this.fecha].servicio.servicio) {
              aux = servicio.nombre;
            }
          }
          var dato = {
            Numero_Elemento: guardia.seguridad.numero,
            Nombre: guardia.nombre,
            Servicio: cliente.nombre + " - " + aux
          }
          this.excelArray.push(dato);
        }
      }
      var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelArray);
      XLSX.utils.book_append_sheet(wb, ws, cliente.nombre);
    }
    XLSX.writeFile(wb, "Guardias" +'.xlsx');
  }

}
