import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { FireService } from 'src/app/services/fire.service';
import { AccionesService } from '../../services/acciones.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.page.html',
  styleUrls: ['./agregar-empleado.page.scss'],
})
export class AgregarEmpleadoPage implements OnInit {

  fechaDeNacimiento: string = new Date().toISOString();
  fechaDeIngreso: string = new Date().toISOString();

  constructor( private fireService: FireService,
               private accionesService: AccionesService,
               private modalCtrl: ModalController) { }

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
    }
  }
}
