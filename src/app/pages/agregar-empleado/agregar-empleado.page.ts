import { Component, OnInit } from '@angular/core';
import { Usuario, Supervisor, Cabina, Directivo } from '../../interfaces/interfaces';
import { FireService } from 'src/app/services/fire.service';
import { AccionesService } from '../../services/acciones.service';
import { NavController, ModalController } from '@ionic/angular';
import { PushFireService } from '../../services/push-fire.service';

@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.page.html',
  styleUrls: ['./agregar-empleado.page.scss'],
})
export class AgregarEmpleadoPage implements OnInit {

  fechaDeNacimiento: string = new Date().toISOString();
  fechaDeIngreso: string = new Date().toISOString();

  supervisores: Supervisor[] = [];
  cabinas: Cabina[] = [];
  directivos: Directivo[] = [];

  constructor( private fireService: FireService,
               private accionesService: AccionesService,
               private modalCtrl: ModalController,
               private pushFire: PushFireService) { }

async ngOnInit() {
    await this.fireService.getAllUsuarios().then(res => {
      res.subscribe(val => {
        this.empleados = val;
        //this.obtenerSeguridad(val);
      });
    });
  }

  usuarioAgregar: Usuario = {
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

  empleados: any[] = [];
  contrasena: string;
  numeroRepetido: boolean = false;

  tipoDeEmpleado(event){
    this.usuarioAgregar.tipo = event.detail.value;
  }

  radios(event){
    this.usuarioAgregar.papeleria = event.detail.value;
  }

  async numeroNoRepetido() {
    this.numeroRepetido = false;

    this.empleados.forEach(element => {
      if(element.numero == this.usuarioAgregar.numero) {
        this.numeroRepetido = true;
      }
    });
  }

  async agregarNuevoEmpleado(){

    await this.numeroNoRepetido();
    if(this.numeroRepetido == true){
      this.accionesService.presentToast("Numero de empleado repetido");
    }
    else{
    //FECHA DE NACIMIENTO
    var diaN = new Date(this.fechaDeNacimiento);
    //@ts-ignore
    this.usuarioAgregar.nacimiento = diaN;
    //FECHA DE INGRESO
    var diaI = new Date(this.fechaDeIngreso);
    //@ts-ignore
    this.usuarioAgregar.fechaDeIngreso = diaI;

    this.usuarioAgregar.contraseña = this.contrasena; //Igualamos contraseña
    this.fireService.addUsuario(this.usuarioAgregar);
    this.modalCtrl.dismiss();
    this.accionesService.presentToast("Empleado agregado");
    this.notificarNuevo();
    }
  }

  async notificarNuevo() {
    await this.cargarDestinatarios();
    await this.fireService.getAllDispositivos().then(res => {
      res.subscribe(val => {
        for(var supervisor of this.supervisores) {
          for(var dispositivo of val) {
            if(dispositivo.numero == supervisor.numero) {
              this.pushFire.enviarPushNuevo(this.usuarioAgregar.nombre, this.usuarioAgregar.celular.toString(), dispositivo.token).subscribe();
              break;
            }
          }
        }
        console.log(this.cabinas);
        for(var cabina of this.cabinas) {
          for(var dispositivo of val) {
            if(dispositivo.numero == cabina.numero) {
              this.pushFire.enviarPushNuevo(this.usuarioAgregar.nombre, this.usuarioAgregar.celular.toString(), dispositivo.token).subscribe();
              break;
            }
          }
        }

        for(var directivo of this.directivos) {
          for(var dispositivo of val) {
            if(dispositivo.numero == directivo.numero) {
              this.pushFire.enviarPushNuevo(this.usuarioAgregar.nombre, this.usuarioAgregar.celular.toString(), dispositivo.token).subscribe();
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

}
