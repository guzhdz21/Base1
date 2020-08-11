import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { FireService } from '../../services/fire.service';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { Usuario, Seguridad, Cliente, Servicio } from '../../interfaces/interfaces';
import { Subscription, interval } from 'rxjs';
import { stringify } from 'querystring';
import { AgregarEmpleadoPage } from '../agregar-empleado/agregar-empleado.page';

@Component({
  selector: 'app-home-rh',
  templateUrl: './home-rh.page.html',
  styleUrls: ['./home-rh.page.scss'],
})
export class HomeRHPage implements OnInit {

    empleados: any[] = [];
    eliminacionConfirmada: boolean = false;
    contraseñaConfirmada: boolean = false;

    textoBuscar = '';

    //Variables visuales generales
    titulo: string = "Informacion General";
    icono: string = "document-text";
  
    //Variables visuales de asistencia
    nacimiento: string = new Date().toISOString();
  
    //Variables del boton asistencia
    asistenciaRegistrada: boolean = false;
    tiempo: boolean = false;
    timer;
    timerSub;
  
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
                private accionesService: AccionesService) { }
  
    async ngOnInit() {

      this.empleados = [];

      await this.obtenerUsuarioLocal();
      await this.obtenerNacimiento();
      await this.obtenerTodosLosEmpleados();
  
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

    async obtenerTodosLosEmpleados() {
      await this.fireService.getAllUsuarios().then(res => {
        res.subscribe(val => {
          this.empleados = val;
          //this.obtenerSeguridad(val);
        });
      });
    }

    async eliminarEmpleado(idEmpleado: number, nombreEmpleado: number){
      await this.accionesService.presentAlertConfirmacionContraseña("¿Estás seguro de eliminar a " + nombreEmpleado + "?", "Ingresa tu contraseña" ,
      [{text: 'Cancelar',handler: (bla) => { 
        this.eliminacionConfirmada = false;
        this.accionesService.presentToast("Eliminación cancelada");}
      }, {text: 'Eliminar',handler: (bla) => {
        if(bla.contraseñaConfirmacion == this.usuario.contraseña){
          this.fireService.removeUsuario(idEmpleado.toString());
          this.accionesService.presentToast("Empleado Eliminado");
        } else{
          this.accionesService.presentToast("Contraseña incorrecta");
        } 
      }}]);
    }

    async modificarEmpleado(idEmpleado: number, nombreEmpleado: number){

      /* const modal = await this.modalCtrl.create({
        component: ModificarEmpleadoPage,
      });
      await modal.present();
      */

      await this.accionesService.presentAlertConfirmacionContraseña("¿Estás seguro de eliminar a " + nombreEmpleado + "?", "Ingresa tu contraseña" ,
      [{text: 'Cancelar',handler: (bla) => { 
        this.eliminacionConfirmada = false;
        this.accionesService.presentToast("Eliminación cancelada");}
      }, {text: 'Eliminar',handler: (bla) => {
        if(bla.contraseñaConfirmacion == this.usuario.contraseña){
          this.fireService.removeUsuario(idEmpleado.toString());
          this.accionesService.presentToast("Empleado Eliminado");
        } else{
          this.accionesService.presentToast("Contraseña incorrecta");
        } 
      }}]);
    }

    async obtenerNacimiento() {
      this.nacimiento = await this.storageService.cargarNacimiento();
    }

    buscar( event ){
      this.textoBuscar = event.detail.value;
    }

    async agregarNuevoEmpleado() {
      const modal = await this.modalCtrl.create({
        component: AgregarEmpleadoPage,
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
        if(this.user.numero != this.usuarioLocal.numero 
          || this.usuarioLocal.contraseña != this.user.contraseña 
          || this.user.tipo != "Recursos humanos") {
          await this.autenSub.unsubscribe();
          await this.timerSub.unsubscribe();
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
  
    async ionViewDidEnter() {
      this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, async () => {
        navigator["app"].exitApp();
      });
    }

}
