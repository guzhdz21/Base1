import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { FireService } from 'src/app/services/fire.service';
import { Platform, ModalController, NavController } from '@ionic/angular';
import { AccionesService } from 'src/app/services/acciones.service';
import { PushFireService } from 'src/app/services/push-fire.service';
import { Subscription, interval } from 'rxjs';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AgregarCompradorPage } from '../agregar-comprador/agregar-comprador.page';
import { Comprador } from '../../interfaces/interfaces';

@Component({
  selector: 'app-home-rm',
  templateUrl: './home-rm.page.html',
  styleUrls: ['./home-rm.page.scss'],
})
export class HomeRmPage implements OnInit {

      //Variables visuales de asistencia
      nacimiento: string = new Date().toISOString();
      rm = [
        {
          icono: 'log-out-outline',
          nombre: 'Cerrar Sesion',
          irA: '/login'
        },
      ];

      //Variables del boton asistencia
      asistenciaRegistrada: boolean = false;
      tiempo: boolean = false;
      timer;
      timerSub;
      empleados: any[] = [];
      textoBuscar = '';

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

      //Variables de funcionalidad
      backButtonSub: Subscription;
      autentificacion;
      autenSub;
      correcto: boolean = true;

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
    this.empleados = [];

    await this.obtenerUsuarioLocal();
    await this.obtenerNacimiento();
    await this.obtenerTodosLosEmpleadosCompradores();

    this.timer = interval(10000);
    this.timerSub = this.timer.subscribe(x => {
      if(this.tiempo == true) {
        this.timerSub.unsubscribe();
      } else {
        //this.checarTiempo();
      }
    });

    this.autentificacion = interval(5000);
    this.autenSub = await this.autentificacion.subscribe(x => {
      this.cargarUsuarioComparar();
    });
  }

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
        //this.obtenerSeguridad(val);
      });
    });
  }

  async obtenerTodosLosEmpleadosCompradores() {
    await this.fireService.getAllCompradores().then(res => {
      res.subscribe(val => {
        this.empleados = val;
        //this.obtenerSeguridad(val);
      });
    });
  }

 /*
  async modificarEmpleado(empleado: Usuario, idEmpleado: string){

     const modal = await this.modalCtrl.create({
      component: ModificarEmpleadoPage,
      componentProps: {
        empleadoAModificar: empleado,
        idEmpleadoAModificar: idEmpleado
      }
    });
    await modal.present();
  }
  */

  async obtenerNacimiento() {
    this.nacimiento = await this.storageService.cargarNacimiento();
  }

  buscar( event ){
    this.textoBuscar = event.detail.value;
  }

  async abrirInformacion( empleadoInfo: Comprador){

    await this.accionesService.presentAlertGenericaInfoEmpleado(empleadoInfo.nombre, "<br><br>Activo: " + empleadoInfo.activo + "<br><br>Articulo: " + empleadoInfo.articulo + 
    "<br><br>Cantidad total: " + empleadoInfo.cantidad + "<br><br>Pagos totales: " + empleadoInfo.pagosT + "<br><br>Pagos restantes: " + empleadoInfo.pagosR);
  }

  async agregarNuevaCompra() {
    const modal = await this.modalCtrl.create({
      component: AgregarCompradorPage,
    });
    await modal.present();
  }

  async cargarUsuarioComparar() {
    if(this.usuarioLocal != null && this.id != null) {
      this.fireService.getUsuario(this.id).then(res => {
        res.subscribe(val => {
          this.user = val;
        });
      });
      this.autentificar();
    }
    return;
  }

  async autentificar() {
    if(this.user && this.usuarioLocal != null) {
      if(this.user.tipo == "Recursos materiales" || this.user.tipo == "Recursos humanos"){}
      else{
        if(this.user.numero != this.usuarioLocal.numero 
          || this.usuarioLocal.contraseña != this.user.contraseña) {
          await this.autenSub.unsubscribe();
          await this.timerSub.unsubscribe();
          await this.procesoSalida();
          await this.navCtrl.navigateRoot("/login");
       }
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

  async ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, async () => {
      navigator["app"].exitApp();
    });
  }

  async redirigir(nombre: string, irA: string) {
    if(nombre == "Cerrar Sesion") {
      await this.storageService.eliminarUsuario();
    }
    await this.navCtrl.navigateRoot(irA);
  }

async eliminarPago(empleado: Comprador, id: string){
    empleado.pagosR--;
    this.fireService.updateCompradores(empleado, id);
    this.accionesService.presentToast("Pago restante eliminado");
  }

}
