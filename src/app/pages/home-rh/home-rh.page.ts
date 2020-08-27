import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { FireService } from '../../services/fire.service';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { Usuario, Seguridad, Cliente, Servicio, ServicioA, Supervisor, Cabina, Directivo } from '../../interfaces/interfaces';
import { Subscription, interval } from 'rxjs';
import { stringify } from 'querystring';
import { AgregarEmpleadoPage } from '../agregar-empleado/agregar-empleado.page';
import { ModificarEmpleadoPage } from '../modificar-empleado/modificar-empleado.page';
import { PushFireService } from '../../services/push-fire.service';

@Component({
  selector: 'app-home-rh',
  templateUrl: './home-rh.page.html',
  styleUrls: ['./home-rh.page.scss'],
})
export class HomeRHPage implements OnInit {

    empleados: any[] = [];
    supervisores: Supervisor[] = [];
    cabinas: Cabina[] = [];
    directivos: Directivo[] = [];
    eliminacionConfirmada: boolean = false;
    contraseñaConfirmada: boolean = false;

    textoBuscar = '';

    //Variables visuales generales
    titulo: string = "Informacion General";
    icono: string = "document-text";
    rh = [
      {
        icono: 'log-out-outline',
        nombre: 'Cerrar Sesion',
        irA: '/login'
      },
    ];

    dias: any[] = [
      {
        dia: "Lunes",
        ver: false,
        servicio: "",
        hora: "",
        tiempo: null,
        color: "",
        flecha: ""
      },
      {
        dia: "Martes",
        ver: false,
        servicio: "",
        hora: "",
        tiempo: null,
        color: "",
        flecha: ""
      },
      {
        dia: "Miercoles",
        ver: false,
        servicio: "",
        hora: "",
        tiempo: null,
        color: "",
        flecha: ""
      },
      {
        dia: "Jueves",
        ver: false,
        servicio: "",
        hora: "",
        tiempo: null,
        color: "",
        flecha: ""
      },
      {
        dia: "Viernes",
        ver: false,
        servicio: "",
        hora: "",
        tiempo: null,
        color: "",
        flecha: ""
      },
      {
        dia: "Sabado",
        ver: false,
        servicio: "",
        hora: "",
        tiempo: null,
        color: "",
        flecha: ""
      },
      {
        dia: "Domingo",
        ver: false,
        servicio: "",
        hora: "",
        tiempo: null,
        color: "",
        flecha: ""
      }
    ]
  
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
                private accionesService: AccionesService,
                private pushFire: PushFireService) { }
  
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

    async eliminarEmpleado(idEmpleado: number, nombreEmpleado: string){
      await this.accionesService.presentAlertConfirmacionContraseña("¿Estás seguro de eliminar a " + nombreEmpleado + "?", "Ingresa tu contraseña" ,
      [{text: 'Cancelar',handler: (bla) => { 
        this.eliminacionConfirmada = false;
        this.accionesService.presentToast("Eliminación cancelada");}
      }, {text: 'Eliminar',handler: (bla) => {
        if(bla.contraseñaConfirmacion == this.usuario.contraseña){
          this.fireService.removeUsuario(idEmpleado.toString());
          this.accionesService.presentToast("Empleado Eliminado");
          this.notificarEliminado(nombreEmpleado);
        } else{
          this.accionesService.presentToast("Contraseña incorrecta");
        } 
      }}]);
    }

    async notificarEliminado(nombre: string) {
      await this.cargarDestinatarios();
      await this.fireService.getAllDispositivos().then(res => {
        res.subscribe(val => {
          for(var supervisor of this.supervisores) {
            for(var dispositivo of val) {
              if(dispositivo.numero == supervisor.numero) {
                this.pushFire.enviarPushEliminado(nombre, dispositivo.token).subscribe();
                break;
              }
            }
          }
          console.log(this.supervisores);
          for(var cabina of this.cabinas) {
            for(var dispositivo of val) {
              if(dispositivo.numero == cabina.numero) {
                this.pushFire.enviarPushEliminado(nombre, dispositivo.token).subscribe();
                break;
              }
            }
          }
  
          for(var directivo of this.directivos) {
            for(var dispositivo of val) {
              if(dispositivo.numero == directivo.numero) {
                this.pushFire.enviarPushEliminado(nombre, dispositivo.token).subscribe();
                break;
              }
            }
          }
        });
      });
      
    }
  
    async cargarDestinatarios() {
      await this.fireService.getAllSupervisores().then(res => {
        res.subscribe(val => {
          this.supervisores = val;
        });
      });
  
      await this.fireService.getAllCabinas().then(res => {
        res.subscribe(val => {
          this.cabinas = val;
        });
      });
  
      await this.fireService.getAllDirectivos().then(res => {
        res.subscribe(val => {
          this.directivos = val;
        });
      });
  
      return;
    }

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

    async obtenerNacimiento() {
      this.nacimiento = await this.storageService.cargarNacimiento();
    }

    buscar( event ){
      this.textoBuscar = event.detail.value;
    }

    async abrirInformacion( empleadoInfo: Usuario){
      var diaN = empleadoInfo.nacimiento.toDate().getDate();
      var mesN = empleadoInfo.nacimiento.toDate().getMonth() + 1;
      console.log(" la var: " + mesN)
      console.log(" la completa: " + empleadoInfo.nacimiento.toDate())
      var anoN = empleadoInfo.nacimiento.toDate().getFullYear();
      var fechaN = diaN + "/" + mesN + "/" + anoN; 

      var diaI = empleadoInfo.fechaDeIngreso.toDate().getDate();
      var mesI = empleadoInfo.fechaDeIngreso.toDate().getMonth() + 1;
      var anoI = empleadoInfo.fechaDeIngreso.toDate().getFullYear();
      var fechaI = diaI + "/" + mesI + "/" + anoI; 

      await this.accionesService.presentAlertGenericaInfoEmpleado(empleadoInfo.nombre, "<br>Número: " + empleadoInfo.numero + "<br><br>Puesto: " + empleadoInfo.tipo + "<br><br>Celular: " + empleadoInfo.celular + "<br><br>Fecha de nacimiento: " + fechaN +
      "<br><br>CURP: " + empleadoInfo.CURP + "<br><br>RFC: " + empleadoInfo.RFC + "<br><br>NSS: " + empleadoInfo.NSS +"<br><br>Domicilio: " + empleadoInfo.domicilio + "<br><br>Papelería: " + empleadoInfo.papeleria + "<br><br>Fecha de alta: " + fechaI);
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

    async redirigir(nombre: string, irA: string) {
      if(nombre == "Cerrar Sesion") {
        await this.storageService.eliminarUsuario();
      }
      await this.navCtrl.navigateRoot(irA);
    }

}
