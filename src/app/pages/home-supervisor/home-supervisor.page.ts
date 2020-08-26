import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { Usuario } from '../../interfaces/interfaces';
import { FireService } from '../../services/fire.service';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.page.html',
  styleUrls: ['./home-supervisor.page.scss'],
})
export class HomeSupervisorPage implements OnInit {

  //Variables visuales generales
  titulo: string = "Informacion General";
  icono = "document-text";
  supervisor = [
    {
      icono: 'warning',
      nombre: 'Alertas Incidentes',
      irA: '/login'
    },
    {
      icono: 'location',
      nombre: 'Ubicacion guardias',
      irA: '/login'
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

  constructor(private plt: Platform,
              private storageService: StorageService,
              private fireService: FireService,
              private navCtrl: NavController,
              private accionesService: AccionesService) { }

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
        || this.user.tipo != "Supervisor") {
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

      case 'Informacion': {
        this.titulo = "Informacion General";
        this.icono = "document-text";
        break;
      }

      case 'Asignaciones': {
        this.titulo = "Asignaciones de Servicios";
        this.icono = "shield";
        break;
      }

      case 'Asistencias': {
        this.titulo = "Asistencias de Guardias";
        this.icono = "checkbox";
        break;
      }

    }
  }

  async redirigir(nombre: string, irA: string) {
    if(nombre == "Cerrar Sesion") {
      await this.storageService.eliminarUsuario();
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
    await this.obtenerUsuarioLocal();

    this.autentificacion = interval(3500);
    this.autenSub = await this.autentificacion.subscribe(x => {
      console.log("verificar");
      this.cargarUsuarioComparar();
    });
  }

  async ionViewWillLeave() {
    await this.autenSub.unsubscribe();
  }

  reinicioVariables() {
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
}
